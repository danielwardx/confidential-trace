import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:travel-address", "Prints the TravelRegistry contract address").setAction(async (_args: TaskArguments, hre) => {
  const { deployments } = hre;
  const deployment = await deployments.get("TravelRegistry");
  console.log(`TravelRegistry address: ${deployment.address}`);
});

task("task:travel-record", "Encrypts and records a new visit")
  .addParam("country", "Numeric country identifier")
  .addParam("city", "Numeric city identifier")
  .addOptionalParam("timestamp", "Unix timestamp, defaults to current time")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { deployments, ethers, fhevm } = hre;

    const countryId = parseInt(taskArguments.country);
    const cityId = parseInt(taskArguments.city);
    const timestampArg = taskArguments.timestamp ? BigInt(taskArguments.timestamp) : BigInt(Math.floor(Date.now() / 1000));

    if (!Number.isInteger(countryId) || !Number.isInteger(cityId)) {
      throw new Error("Country and city must be integers");
    }

    await fhevm.initializeCLIApi();

    const deployment = await deployments.get("TravelRegistry");
    const signers = await ethers.getSigners();

    const encryptedInput = await fhevm
      .createEncryptedInput(deployment.address, signers[0].address)
      .add32(countryId)
      .add32(cityId)
      .encrypt();

    const contract = await ethers.getContractAt("TravelRegistry", deployment.address);

    const tx = await contract
      .connect(signers[0])
      .recordVisit(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        timestampArg,
      );

    console.log(`Transaction submitted: ${tx.hash}`);
    await tx.wait();
    console.log("Visit recorded successfully");
  });

task("task:travel-decrypt", "Decrypts visits for the first signer")
  .addOptionalParam("user", "Override user address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { deployments, ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const deployment = await deployments.get("TravelRegistry");
    const signers = await ethers.getSigners();
    const userAddress = (taskArguments.user as string | undefined) ?? signers[0].address;

    const contract = await ethers.getContractAt("TravelRegistry", deployment.address);
    const visits = await contract.getVisits(userAddress);

    if (!visits.length) {
      console.log("No visits recorded for", userAddress);
      return;
    }

    console.log(`Found ${visits.length} visits. Decrypting...`);

    for (let i = 0; i < visits.length; i++) {
      const visit = visits[i];
      const country = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        visit.countryId,
        deployment.address,
        signers[0],
      );
      const city = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        visit.cityId,
        deployment.address,
        signers[0],
      );

      console.log(`Visit #${i}: country=${country.toString()} city=${city.toString()} timestamp=${visit.timestamp}`);
    }
  });
