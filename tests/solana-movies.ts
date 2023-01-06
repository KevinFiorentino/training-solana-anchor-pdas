import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaMovies } from "../target/types/solana_movies";
import { TextEncoder } from "util";

const { PublicKey, SystemProgram } = anchor.web3;
const assert = require("assert");

const stringToBytes = (input: string): Uint8Array => {
  return new TextEncoder().encode(input);
};

describe("Solana Movies Test", () => {

  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SolanaMovies as Program<SolanaMovies>;

  function assertNotNull<T>(v: T | null): T {
    if (!v) throw new Error();
    return v;
  }

  it("Add movie", async () => {

    const movieName = "Back to the Future I";

    const [pda] = await PublicKey.findProgramAddress(
      [
        stringToBytes("movie_account"),
        anchor.getProvider().wallet.publicKey.toBytes(),
        stringToBytes(movieName),
      ],
      program.programId
    );

    let tx = await program.methods
      .addMovie(movieName)
      .accounts({
        movie: pda,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    assertNotNull(tx);
  });

  it("Get all movies", async () => {
    const movies = await program.account.movie.all();
    assert.equal(1, movies.length);
  });

  it("Finds movies by public key", async () => {
    const moviesByOwner = await program.account.movie.all([
      {
        memcmp: {
          bytes: anchor.getProvider().wallet.publicKey.toBase58(),
          offset: 8,
        },
      },
    ]);
    assert.equal(1, moviesByOwner.length);
  });
  
});
