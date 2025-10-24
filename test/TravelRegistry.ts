import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { TravelRegistry, TravelRegistry__factory } from "../types";

type Signers = {
  user: HardhatEthersSigner;
  other: HardhatEthersSigner;
};

async function deployTravelRegistry() {
  const factory = (await ethers.getContractFactory("TravelRegistry")) as TravelRegistry__factory;
  const contract = (await factory.deploy()) as TravelRegistry;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("TravelRegistry", function () {
  let signers: Signers;
  let contract: TravelRegistry;
  let contractAddress: string;

  before(async function () {
    const [user, other] = await ethers.getSigners();
    signers = { user, other };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("TravelRegistry tests require the mock FHEVM environment");
      this.skip();
    }

    ({ contract, contractAddress } = await deployTravelRegistry());
  });

  it("returns zero visits for new users", async function () {
    const count = await contract.getVisitCount(signers.user.address);
    expect(count).to.equal(0n);

    const visits = await contract.getVisits(signers.user.address);
    expect(visits.length).to.equal(0);
  });

  it("stores and decrypts a recorded visit", async function () {
    const countryId = 44;
    const cityId = 101;
    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.user.address)
      .add32(countryId)
      .add32(cityId)
      .encrypt();

    const tx = await contract
      .connect(signers.user)
      .recordVisit(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        timestamp,
      );
    await tx.wait();

    const count = await contract.getVisitCount(signers.user.address);
    expect(count).to.equal(1n);

    const visits = await contract.getVisits(signers.user.address);
    expect(visits.length).to.equal(1);
    expect(visits[0].timestamp).to.equal(timestamp);

    const decryptedCountry = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      visits[0].countryId,
      contractAddress,
      signers.user,
    );
    const decryptedCity = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      visits[0].cityId,
      contractAddress,
      signers.user,
    );

    expect(decryptedCountry).to.equal(BigInt(countryId));
    expect(decryptedCity).to.equal(BigInt(cityId));
  });

  it("keeps visits isolated per user", async function () {
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.user.address)
      .add32(1)
      .add32(2)
      .encrypt();

    await contract
      .connect(signers.user)
      .recordVisit(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        BigInt(Math.floor(Date.now() / 1000)),
      );

    const otherCount = await contract.getVisitCount(signers.other.address);
    expect(otherCount).to.equal(0n);
  });
});
