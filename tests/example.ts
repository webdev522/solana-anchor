import * as assert from "assert";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Example } from "../target/types/example";

describe("example", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Example as Program<Example>;
  const myAccount = anchor.web3.Keypair.generate();

  console.log(myAccount.publicKey.toBase58());
  console.log(provider.wallet.publicKey.toBase58());
  console.log(anchor.web3.SystemProgram.programId.toBase58());

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize(new anchor.BN(123), {
      accounts: {
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [myAccount],
    });
    console.log("Your transaction signature", tx);

    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.ok(account.data.eq(new anchor.BN(123)));
    console.log(account.data);
  });
});
