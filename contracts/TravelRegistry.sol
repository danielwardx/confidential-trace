// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract TravelRegistry is SepoliaConfig {
    struct Visit {
        euint32 countryId;
        euint32 cityId;
        uint64 timestamp;
    }

    mapping(address => Visit[]) private _visits;

    event VisitRecorded(address indexed user, uint256 indexed index, uint64 timestamp);

    function recordVisit(
        externalEuint32 encryptedCountryId,
        externalEuint32 encryptedCityId,
        bytes calldata inputProof,
        uint64 travelTimestamp
    ) external {
        require(travelTimestamp > 0, "Invalid timestamp");

        euint32 countryId = FHE.fromExternal(encryptedCountryId, inputProof);
        euint32 cityId = FHE.fromExternal(encryptedCityId, inputProof);

        Visit storage newVisit = _visits[msg.sender].push();
        newVisit.countryId = countryId;
        newVisit.cityId = cityId;
        newVisit.timestamp = travelTimestamp;

        FHE.allowThis(newVisit.countryId);
        FHE.allow(newVisit.countryId, msg.sender);
        FHE.allowThis(newVisit.cityId);
        FHE.allow(newVisit.cityId, msg.sender);

        emit VisitRecorded(msg.sender, _visits[msg.sender].length - 1, travelTimestamp);
    }

    function getVisits(address user) external view returns (Visit[] memory) {
        return _visits[user];
    }

    function getVisit(address user, uint256 index) external view returns (Visit memory) {
        require(index < _visits[user].length, "Invalid index");
        return _visits[user][index];
    }

    function getVisitCount(address user) external view returns (uint256) {
        return _visits[user].length;
    }
}
