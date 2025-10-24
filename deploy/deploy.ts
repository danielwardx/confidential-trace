import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedTravelRegistry = await deploy("TravelRegistry", {
    from: deployer,
    log: true,
  });

  console.log(`TravelRegistry contract: `, deployedTravelRegistry.address);
};
export default func;
func.id = "deploy_travelRegistry"; // id required to prevent reexecution
func.tags = ["TravelRegistry"];
