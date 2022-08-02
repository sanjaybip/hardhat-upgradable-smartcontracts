import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployBoxV2: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts, network, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    let waitBlockConfirmations = 1;
    if (!developmentChains.includes(network.name)) {
        waitBlockConfirmations = 4;
    }

    log(`------------Deploying--------------`);
    const boxv2 = await deploy("BoxV2", {
        args: [],
        from: deployer,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(boxv2.address, []);
    }
    log("----------------------------------------------------");
};
export default deployBoxV2;
deployBoxV2.tags = ["all", "boxv2"];
