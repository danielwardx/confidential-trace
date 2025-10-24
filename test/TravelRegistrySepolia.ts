import { expect } from "chai";
import { ethers, fhevm, deployments } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TravelRegistrySepolia", function () {
  let signer: HardhatEthersSigner;
  let contractAddress: string;

  function logProgress(step: number, total: number, message: string) {
    console.log(`${step}/${total} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn("TravelRegistrySepolia tests require the Sepolia network");
      this.skip();
    }

    const deployment = await deployments.get("TravelRegistry");
    contractAddress = deployment.address;

    const [firstSigner] = await ethers.getSigners();
    signer = firstSigner;
  });

  it("records and decrypts a visit", async function () {
    this.timeout(5 * 60000);

    const steps = 8;
    let current = 0;

    await fhevm.initializeCLIApi();
    logProgress(++current, steps, "Preparing encrypted input");

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add32(7)
      .add32(21)
      .encrypt();

    logProgress(++current, steps, "Sending recordVisit transaction");
    const contract = await ethers.getContractAt("TravelRegistry", contractAddress);

    const tx = await contract
      .connect(signer)
      .recordVisit(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        BigInt(Math.floor(Date.now() / 1000)),
      );

    logProgress(++current, steps, `Waiting for tx ${tx.hash}`);
    await tx.wait();

    logProgress(++current, steps, "Fetching visits");
    const visits = await contract.getVisits(signer.address);
    expect(visits.length).to.be.greaterThan(0);

    const latest = visits[visits.length - 1];

    logProgress(++current, steps, "Decrypting country");
    const country = await fhevm.userDecryptEuint(FhevmType.euint32, latest.countryId, contractAddress, signer);

    logProgress(++current, steps, "Decrypting city");
    const city = await fhevm.userDecryptEuint(FhevmType.euint32, latest.cityId, contractAddress, signer);

    logProgress(++current, steps, "Asserting decrypted values");
    expect(country).to.equal(7n);
    expect(city).to.equal(21n);
  });
});
