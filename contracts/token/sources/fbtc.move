module token::fbtc {

    use sui::coin::{Self, TreasuryCap};
    use sui::url;

    public struct FBTC has drop {}

    fun init(witness: FBTC, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9,
            b"FBTC",
            b"FBTC",
            b"Faker bitcoin",
            option::some(
                url::new_unsafe_from_bytes(b"https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040")
            ),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<FBTC>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}