module cube_hunt::game {
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;

    /// Error codes
    const EInvalidCoordinate: u64 = 0;
    const ECubeAlreadyRevealed: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const ENotOwner: u64 = 3;

    /// Game constants
    const GRID_SIZE: u64 = 100;
    // const MINT_PRICE: u64 = 0; 

    /// The Game State shared object
    struct GameState has key {
        id: UID,
        admin: address,
        revealed_bitmap: vector<u8>, // Simple bitmap for 100x100 grid (10000 bits = 1250 bytes)
        balance: Balance<SUI>,
    }

    /// The Cube NFT
    struct CubeNFT has key, store {
        id: UID,
        x: u64,
        y: u64,
        rarity: String,
        color: String,
        pattern: String,
        glow: bool,
        animation: String,
        minted_at: u64,
    }

    /// Marketplace Listing Wrapper
    struct ListingWrapper has key {
        id: UID,
        seller: address,
        price: u64,
        nft: CubeNFT,
    }

    /// Events
    struct CubeRevealed has copy, drop {
        finder: address,
        x: u64,
        y: u64,
        rarity: String,
        nft_id: ID,
    }

    struct NFTListed has copy, drop {
        seller: address,
        nft_id: ID,
        listing_id: ID,
        price: u64,
    }

    struct NFTSold has copy, drop {
        seller: address,
        buyer: address,
        nft_id: ID,
        price: u64,
    }

    fun init(ctx: &mut TxContext) {
        // Initialize bitmap with zeros (1250 bytes for 10000 bits)
        let bitmap = vector::empty<u8>();
        let i = 0;
        while (i < 1250) {
            vector::push_back(&mut bitmap, 0);
            i = i + 1;
        };

        transfer::share_object(GameState {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            revealed_bitmap: bitmap,
            balance: balance::zero(),
        });
    }

    /// Reveal a cube and mint an NFT
    /// Uses simple pseudo-randomness based on coordinates and timestamp
    public entry fun reveal_cube(
        game: &mut GameState,
        clock: &Clock,
        x: u64,
        y: u64,
        ctx: &mut TxContext
    ) {
        assert!(x < GRID_SIZE && y < GRID_SIZE, EInvalidCoordinate);
        
        // Check if already revealed
        let byte_index = (y * GRID_SIZE + x) / 8;
        let bit_offset = (y * GRID_SIZE + x) % 8;
        let byte = *vector::borrow(&game.revealed_bitmap, byte_index);
        assert!((byte >> (bit_offset as u8)) & 1 == 0, ECubeAlreadyRevealed);

        // Mark as revealed
        let new_byte = byte | (1 << (bit_offset as u8));
        *vector::borrow_mut(&mut game.revealed_bitmap, byte_index) = new_byte;

        // Generate Randomness (Pseudo for Hackathon)
        let timestamp = clock::timestamp_ms(clock);
        let seed = timestamp + x + y + (tx_context::epoch(ctx) as u64);
        
        let (rarity, color, pattern, glow, animation) = generate_traits(seed);

        let nft = CubeNFT {
            id: object::new(ctx),
            x,
            y,
            rarity,
            color,
            pattern,
            glow,
            animation,
            minted_at: timestamp,
        };

        event::emit(CubeRevealed {
            finder: tx_context::sender(ctx),
            x,
            y,
            rarity: nft.rarity,
            nft_id: object::id(&nft),
        });

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Helper to generate traits
    fun generate_traits(seed: u64): (String, String, String, bool, String) {
        let r = seed % 1000;
        
        let rarity = if (r < 5) { string::utf8(b"legendary") }
        else if (r < 20) { string::utf8(b"epic") }
        else if (r < 100) { string::utf8(b"rare") }
        else if (r < 300) { string::utf8(b"uncommon") }
        else { string::utf8(b"common") };

        // Simplified trait generation logic
        let color = if (r % 5 == 0) { string::utf8(b"#F59E0B") } // Gold
        else if (r % 5 == 1) { string::utf8(b"#8B5CF6") } // Purple
        else if (r % 5 == 2) { string::utf8(b"#3B82F6") } // Blue
        else if (r % 5 == 3) { string::utf8(b"#10B981") } // Green
        else { string::utf8(b"#6B7280") }; // Gray

        let pattern = if (r % 4 == 0) { string::utf8(b"solid") }
        else if (r % 4 == 1) { string::utf8(b"striped") }
        else if (r % 4 == 2) { string::utf8(b"dotted") }
        else { string::utf8(b"gradient") };

        let glow = r < 100; // Rare+ glow
        
        let animation = if (r < 50) { string::utf8(b"pulse") }
        else if (r < 150) { string::utf8(b"float") }
        else { string::utf8(b"none") };

        (rarity, color, pattern, glow, animation)
    }

    // --- Marketplace Logic ---

    /// List an NFT for sale
    public entry fun list_nft(
        nft: CubeNFT,
        price: u64,
        ctx: &mut TxContext
    ) {
        let id = object::id(&nft);
        let seller = tx_context::sender(ctx);

        // Wrap NFT in a listing object (Simplified marketplace)
        // In a real app, we might use a Kiosk or a shared marketplace object
        // Here we'll use dynamic object fields or just wrap it. 
        // For simplicity, let's use a wrapper approach where the NFT is owned by the Listing object?
        // Actually, let's make the Listing object wrap the NFT.
        
        // Note: In Sui, to wrap, the NFT must have `store`. CubeNFT has `store`.
        
        // We need a way to store the NFT. 
        // Let's create a Listing object that holds the NFT.
        
        let listing = ListingWrapper {
            id: object::new(ctx),
            seller,
            price,
            nft,
        };

        event::emit(NFTListed {
            seller,
            nft_id: id,
            listing_id: object::id(&listing),
            price,
        });

        transfer::share_object(listing);
    }

    /// Buy an NFT
    public entry fun buy_nft(
        listing: ListingWrapper,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let ListingWrapper { id, seller, price, nft } = listing;
        let nft_id = object::id(&nft); // Capture ID before move
        object::delete(id);

        assert!(coin::value(&payment) >= price, EInsufficientPayment);

        // Transfer payment to seller
        transfer::public_transfer(payment, seller);

        // Transfer NFT to buyer
        transfer::public_transfer(nft, tx_context::sender(ctx));

        event::emit(NFTSold {
            seller,
            buyer: tx_context::sender(ctx),
            nft_id,
            price,
        });
    }

    /// Cancel listing
    public entry fun cancel_listing(
        listing: ListingWrapper,
        ctx: &mut TxContext
    ) {
        let ListingWrapper { id, seller, price: _, nft } = listing;
        assert!(tx_context::sender(ctx) == seller, ENotOwner);
        
        object::delete(id);
        transfer::public_transfer(nft, seller);
    }
}
