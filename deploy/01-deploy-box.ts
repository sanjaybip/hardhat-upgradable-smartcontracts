import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts, network, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    let waitBlockConfirmations = 1;
    if (!developmentChains.includes(network.name)) {
        waitBlockConfirmations = 4;
    }

    log(`------------Deploying--------------`);
    const box = await deploy("Box", {
        args: [],
        from: deployer,
        log: true,
        waitConfirmations: waitBlockConfirmations,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(box.address, []);
    }
    log("----------------------------------------------------");
};
export default deployBox;
deployBox.tags = ["all", "box"];
