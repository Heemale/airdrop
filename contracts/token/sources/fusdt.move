module token::fusdt {

    use sui::coin::{Self, TreasuryCap};
    use sui::url;

    public struct FUSDT has drop {}

    fun init(witness: FUSDT, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9,
            b"FUSDT",
            b"FUSDT",
            b"Faker usdt coin",
            option::some(
                url::new_unsafe_from_bytes(b"https://cryptologos.cc/logos/tether-usdt-logo.png?v=040")
            ),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<FUSDT>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}