module airdrop::airdrop;

use sui::vec_map::{Self, VecMap};

public struct Node has store, drop {
    rank: u8,
    name: vector<u8>,
    limit: u64,
    price: u64,
}

public struct Nodes has key, store {
    id: UID,
    nodes: VecMap<u8, Node>,
}

fun init(ctx: &mut TxContext) {
    let nodes = Nodes {
        id: object::new(ctx),
        nodes: vec_map::empty(),
    };
    transfer::public_transfer(nodes, tx_context::sender(ctx));
}

entry fun insertNode(nodesId: &mut Nodes, rank: u8, name: vector<u8>, limit: u64, price: u64) {
    let Nodes {id: _, nodes} = nodesId;
    let node = Node {
        rank,
        name,
        limit,
        price,
    };
    vec_map::insert(nodes, rank, node);
}

entry fun removeNode(nodesId: &mut Nodes, rank: u8) {
    let Nodes {id: _, nodes} = nodesId;
    vec_map::remove(nodes, &rank);
}

entry fun modifyNode(nodesId: &mut Nodes, rank: u8, name: vector<u8>, limit: u64, price: u64) {
    let Nodes {id: _, nodes} = nodesId;
    let node = Node {
        rank,
        name,
        limit,
        price,
    };
    vec_map::remove(nodes, &rank);
    vec_map::insert(nodes, rank, node);
}
