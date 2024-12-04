module token::fsui {

    use sui::coin::{Self, TreasuryCap};
    use sui::url;

    public struct FSUI has drop {}

    fun init(witness: FSUI, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9,
            b"FSUI",
            b"FSUI",
            b"FSUI Coin",
            option::some(
                url::new_unsafe_from_bytes(b"https://cryptologos.cc/logos/sui-sui-logo.png?v=035")
            ),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<FSUI>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}