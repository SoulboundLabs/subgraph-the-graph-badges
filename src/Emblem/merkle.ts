import {
  EarnedBadge,
  EarnedBadgeCount,
  MerkleRoot,
} from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { crypto, Bytes } from "@graphprotocol/graph-ts";
import { MerkleRootPosted } from "../../generated/EmblemSubgraphController/EmblemSubgraphController";

export function processMerkleRootPosted(event: MerkleRootPosted): void {
  let r = _generateMerkleRoot(
    event.params._startingIndex.toI32(),
    event.params._treeSize.toI32()
  );
  let mRoot = new MerkleRoot(r.toHexString());
  mRoot.root = event.params._root;
  mRoot.earnedBadgeCountStart = event.params._startingIndex.toI32();
  mRoot.numberOfBadges = event.params._treeSize.toI32();
  mRoot.valid = event.params._root == r;
  mRoot.save();
}

function _generateMerkleRoot(
  badgeNumberStart: i32,
  numberOfBadges: i32
): Bytes {
  let maxDepth = Math.log2(numberOfBadges) as i32;
  return _generateMerkleRootWithDepth(
    badgeNumberStart,
    numberOfBadges,
    0,
    maxDepth
  );
}

function _generateMerkleRootWithDepth(
  badgeNumberStart: i32,
  numberOfBadges: i32,
  depth: i32,
  maxDepth: i32
): Bytes {
  if (numberOfBadges > 2) {
    let leftBranch = _generateMerkleRootWithDepth(
      badgeNumberStart,
      numberOfBadges / 2,
      depth + 1,
      maxDepth
    );
    let rightBranch = _generateMerkleRootWithDepth(
      badgeNumberStart + numberOfBadges / 2,
      numberOfBadges / 2,
      depth + 1,
      maxDepth
    );
    let encoded = _concatBytes32(leftBranch, rightBranch);
    let hash = changetype<Bytes>(crypto.keccak256(encoded));

    return hash;
  } else {
    let leftLeaf = _leafIdToHash(BigInt.fromI32(badgeNumberStart).toString());
    let rightLeaf = _leafIdToHash(
      BigInt.fromI32(badgeNumberStart + 1).toString()
    );
    let encoded = _concatBytes32(leftLeaf, rightLeaf);
    let hash = changetype<Bytes>(crypto.keccak256(encoded));

    return hash;
  }
}

function _concatBytes32(firstBytes: Bytes, secondBytes: Bytes): Bytes {
  let fullBytes = Bytes.fromHexString(
    firstBytes
      .toHex()
      .concat(
        "5555555555555555555555555555555555555555555555555555555555555555"
      )
  );
  for (let i = 0; i < 32; i++) {
    fullBytes.fill(secondBytes[i], i + 32, i + 33);
  }
  return changetype<Bytes>(fullBytes);
}

function _leafIdToHash(leafId: string): Bytes {
  let leaf = EarnedBadgeCount.load(leafId) as EarnedBadgeCount;
  let earnedBadge = EarnedBadge.load(leaf.earnedBadge) as EarnedBadge;
  return changetype<Bytes>(earnedBadge.hash);
}
