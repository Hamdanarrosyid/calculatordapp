import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { assert } from "chai"
import { Calculatordapp } from "../target/types/calculatordapp"

describe("calculatordapp", () => {
  console.log(process.env.ANCHOR_PROVIDER_URL)
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  let _calculator:anchor.web3.Keypair

  const calculator = anchor.web3.Keypair.generate()
  const program = anchor.workspace.Calculatordapp as Program<Calculatordapp>

  it("Creates a calculator", async () => {
    await program.methods.create("Welcome to Solana")
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([calculator])
      .rpc()

    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === 'Welcome to Solana')
    _calculator = calculator
  })

  it("Adss two numbers", async () => {
    const calculator = _calculator

    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
      .accounts({calculator: calculator.publicKey})
      .rpc()

      const account = await program.account.calculator.fetch(calculator.publicKey)
      assert.ok(account.result.eq(new anchor.BN(5)))
      assert.ok(account.greeting === 'Welcome to Solana')
  })

  it("Multiples two numbers", async () => {
    const calculator = _calculator

    await program.methods.multiply(new anchor.BN(2), new anchor.BN(3))
      .accounts({calculator: calculator.publicKey})
      .rpc()

      const account = await program.account.calculator.fetch(calculator.publicKey)
      assert.ok(account.result.eq(new anchor.BN(6)))
      assert.ok(account.greeting === 'Welcome to Solana')
  })

  it("Subtractions two numbers", async () => {
    const calculator = _calculator

    await program.methods.substract(new anchor.BN(3), new anchor.BN(2))
      .accounts({calculator: calculator.publicKey})
      .rpc()

      const account = await program.account.calculator.fetch(calculator.publicKey)
      assert.ok(account.result.eq(new anchor.BN(1)))
      assert.ok(account.greeting === 'Welcome to Solana')
  })

  it("Divides two numbers", async () => {
    const calculator = _calculator

    await program.methods.divide(new anchor.BN(10), new anchor.BN(2))
      .accounts({calculator: calculator.publicKey})
      .rpc()

      const account = await program.account.calculator.fetch(calculator.publicKey)
      assert.ok(account.result.eq(new anchor.BN(5)))
      assert.ok(account.remainder.eq(new anchor.BN(0)))
      assert.ok(account.greeting === 'Welcome to Solana')
  })
})