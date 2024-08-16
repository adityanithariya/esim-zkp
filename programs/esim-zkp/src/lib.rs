use anchor_lang::prelude::*;

mod states;
mod instructions;
use instructions::*;

declare_id!("7szrUTgx4Ks3EkpC99uvyeaamccQbZ49dCwVmpvutYDt");

#[program]
pub mod esim_zkp {

    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        address: String,
        phone_number: String,
        nullifier: String,
        active: bool,
        gender: u8,
        pincode: u32,
        state: String,
    ) -> Result<()> {
        ctx.accounts.initialize(
            address,
            phone_number,
            nullifier,
            active,
            gender,
            pincode,
            state,
            &ctx.bumps,
        )?;

        msg!("eSIM Added to PDA: {}", ctx.accounts.esim.key());
        Ok(())
    }

    pub fn set_status(
        ctx: Context<Status>,
        _address: String,
        phone_number: String,
        status: bool,
    ) -> Result<()> {
        ctx.accounts.set_status(status)?;
        msg!("Status set to {} for {}", status, phone_number);
        Ok(())
    }

    pub fn delete(_ctx: Context<Delete>, _address: String, phone_number: String) -> Result<()> {
        msg!("SIM with phone number {} deleted!", phone_number);
        Ok(())
    }
}
