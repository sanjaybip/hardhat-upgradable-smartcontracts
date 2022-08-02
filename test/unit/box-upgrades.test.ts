import { assert } from "chai";
import { network, deployments, ethers } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { TransparentUpgradeableProxy, Box, BoxV2, ProxyAdmin } from "../../typechain-types";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Upgradeable tests", () => {
          let box: Box;
          let transparentProxy: TransparentUpgradeableProxy;
          let proxyBox: Box;
          let boxProxyAdmin: ProxyAdmin;
          beforeEach(async () => {
              await deployments.fixture(["box"]);
              box = await ethers.getContract("Box");
              transparentProxy = await ethers.getContract("Box_Proxy");
              proxyBox = await ethers.getContractAt("Box", transparentProxy.address);
              boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
          });
          it("can deploy and upgrade a contract", async () => {
              const startingVersion = await proxyBox.version();
              assert.equal(startingVersion.toString(), "1");
              await deployments.fixture(["boxv2"]);
              const boxV2 = await ethers.getContract("BoxV2");
              const upgradeTx = await boxProxyAdmin.upgrade(
                  transparentProxy.address,
                  boxV2.address
              );
              await upgradeTx.wait(1);
              const endingVersion = await proxyBox.version();
              assert.equal(endingVersion.toString(), "2");
          });
      });
