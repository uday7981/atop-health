// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Here TokenFactory is an ERC721(NFT Based) smart contract which represents a collection of NFT tokens, this nft collection has an owner(user)
// As of now each user can deploy only one contract in their name
// Every instance of the contract TokenFcatory requires two special property i) baseURI ii) name of the user iii) Unique identifier of the nft collection (integer)
// Only the owner who will be deploying this contract can mint tokens of this nft collection

contract TokenFactory is ERC721Enumerable, Ownable {
    /**
     * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */

    /// mapping recording the price of each token referenced by its cipher ID

    // Token Factory Characteristics
    bytes32 _baseTokenURI;

    // Details of Owner Captured from Sign up page + while deploying
    struct ownerDetailsType {
        // Name of Owner
        bytes32 _ownerName;
        //Address of Owner
        address payable _ownerAddress;
        uint256 _ownerAge;
        bytes32 _ownerBloodGroup;
        bytes32 _ownerAllergies;
        bytes32 _ownerMedication;
        bytes32 _ownerAbout;
    }

    ownerDetailsType public ownerDetails;

    // Represents Id of Collection
    uint256 public _collectionId;

    // _paused is used to pause the contract in case of an emergency
    bool public _paused;

    // max number of Tokens minted in TokenFactory
    uint256 public maxTokenIds = 100;

    // total number of tokenIds minted
    uint256 public tokenIds;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused");
        _;
    }

    /**
     * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
     * Constructor for TokenFactory takes in the baseURI to set _baseTokenURI for the collection.
     */

    function concatenate(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a, " ", b));
    }

    function getFinalString(string memory a2, uint256 b2) public pure returns (string memory) {
        string memory new_b2 = Strings.toString(b2);
        return concatenate(a2, new_b2);
    }

    function isInArray(address[] memory myArray, address myAddress) public pure returns (bool) {
        for (uint i = 0; i < myArray.length; i++) {
            if (myArray[i] == myAddress) {
                return true;
            }
        }
        return false;
    }

    // function removeFromArray(
    //     address[] memory myArray,
    //     address addressToRemove
    // ) public pure returns (address[] memory) {
    //     for (uint i = 0; i < myArray.length; i++) {
    //         if (myArray[i] == addressToRemove) {
    //             myArray[i] = address(0);
    //             break;
    //         }
    //     }
    //     return myArray;
    // }

    constructor(
        bytes32 baseURI,
        bytes32 ownerName,
        address payable ownerAddress,
        uint256 ownerAge,
        bytes32 ownerBloodGroup,
        bytes32 ownerAllergies,
        bytes32 ownerMedication,
        bytes32 ownerAbout,
        uint256 uid
    ) ERC721(getFinalString("Token Factory", uid), getFinalString("TF", uid)) {
        _baseTokenURI = baseURI;
        _collectionId = uid;

        ownerDetails = ownerDetailsType({
            _ownerName: ownerName,
            _ownerAddress: ownerAddress,
            _ownerAge: ownerAge,
            _ownerBloodGroup: ownerBloodGroup,
            _ownerAllergies: ownerAllergies,
            _ownerMedication: ownerMedication,
            _ownerAbout: ownerAbout
        });

        transferOwnership(ownerAddress);
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    // Token Characteristics (TokenDetail, buyDealsForTokenId )

    // mapping(uint => BuyDeal[]) public buyDealsForTokenId; // buyDealsForTokenId[tokenId], contains all the BuyDeal Objects which have requested for tokenId
    mapping(uint => TokenDetail) public id_TokenDetailMapping; // Mapping of Id with Details
    mapping(uint => TokenAccessDetail) public id_TokenAccessDetailMapping;

    struct TokenAccessDetail {
        bool _is_public;
        uint256 _price;
        address[] _allowedAddresses;
    }

    struct TokenDetail {
        address payable _addressOfOwner;
        uint256 _tokenId;
        string _dataDescription;
        string _dataUrl;
    }

    /**
     * @dev mint allows a user to mint 1 NFT token per transaction .
     */

    // Submit file -> returns cypherId
    function mint(
        string memory dataDescription,
        string memory dataUrl
    ) public payable onlyWhenNotPaused onlyOwner returns (uint256) {
        require(msg.sender == ownerDetails._ownerAddress);
        require(tokenIds < maxTokenIds, "Exceed maximum TokwnFactory supply");

        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);

        // Medusa

        TokenDetail memory _newTokenDetail = TokenDetail({
            _addressOfOwner: ownerDetails._ownerAddress,
            _tokenId: tokenIds,
            _dataDescription: dataDescription,
            _dataUrl: dataUrl
        });

        TokenAccessDetail memory _newTokenAccessDetail = TokenAccessDetail(
            false,
            0,
            new address[](0)
        );

        id_TokenDetailMapping[tokenIds] = _newTokenDetail;
        id_TokenAccessDetailMapping[tokenIds] = _newTokenAccessDetail;

        return tokenIds;
    }

    function isUserValid(uint256 tokenId, address userAddress) public view returns (bool) {
        if (id_TokenDetailMapping[tokenId]._addressOfOwner == userAddress) {
            return true;
        } else if (id_TokenAccessDetailMapping[tokenId]._is_public) {
            return true;
        } else {
            return isInArray(id_TokenAccessDetailMapping[tokenId]._allowedAddresses, userAddress);
        }
    }

    //Events

    /// oracleResult gets called when the Medusa network successfully reencrypted
    /// the ciphertext to the given public key called in the previous method.
    /// This contract here simply emits an event so the client can listen on it and
    /// pick up on the cipher and locally decrypt.

    //Generate a reencryption request -> returns requestId
    // function buyTokenId(uint256 targetTokenId) external payable returns (uint256) {
    //     require(targetTokenId > 0 && targetTokenId <= tokenIds);
    //     require(_allowedAddresesFor_ReEncryption[targetTokenId][msg.sender] == true);

    //     uint256 cipherId = id_TokenDetailMapping[targetTokenId]._cipherId;
    //     uint256 requestId = oracle.requestReencryption(cipherId, buyerPublicKey); // Medusa

    //     emit NewReencryptionRequest(msg.sender, ownerDetails._ownerAddress, requestId, cipherId);

    //     ownerDetails._ownerAddress.transfer(msg.value); // Receive msg.value in smart contract address and pay msg.value to the owner

    //     return requestId;
    // }

    function getOwnerDetails() public view returns (ownerDetailsType memory) {
        return ownerDetails;
    }

    function getAllowedAddress(uint256 tokenId) public view returns (address[] memory) {
        return id_TokenAccessDetailMapping[tokenId]._allowedAddresses;
    }

    function setPrice(uint256 _tokenId, uint256 new_price) public onlyOwner {
        id_TokenAccessDetailMapping[_tokenId]._price = new_price;
    }

    function setIsPublic(uint256 _tokenId, bool _is_public) public onlyOwner {
        id_TokenAccessDetailMapping[_tokenId]._is_public = _is_public;
    }

    // function addAllowedAddress(uint256 _tokenId, address _address) public onlyOwner {
    //     id_TokenAccessDetailMapping[_tokenId]._allowedAddresses.push(_address);
    // }

    function replaceAllowedAddress(uint256 _tokenId, address[] memory _addresses) public onlyOwner {
        id_TokenAccessDetailMapping[_tokenId]._allowedAddresses = _addresses;
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */
    // function _baseURI() internal view virtual override returns (string memory) {
    //     return _baseTokenURI;
    // }

    /**
     * @dev setPaused makes the contract paused or unpaused
     */
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
