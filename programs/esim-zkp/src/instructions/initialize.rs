use anchor_lang::prelude::*;

use crate::states::ESIM;

#[derive(Accounts)]
#[instruction(address: String, phone_number: String)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + ESIM::INIT_SPACE, seeds = [user.key().as_ref(), address.as_ref(), phone_number.as_ref()], bump)]
    pub esim: Account<'info, ESIM>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(
        &mut self,
        address: String,
        phone_number: String,
        nullifier: String,
        active: bool,
        gender: u8,
        pincode: u32,
        state: String,
        bumps: &InitializeBumps,
    ) -> Result<()> {
        self.esim.set_inner(ESIM {
            address,
            phone_number,
            nullifier,
            active,
            gender,
            pincode,
            state,
            updated_at: Clock::get()?.unix_timestamp,
            bump: bumps.esim,
        });

        msg!("eSIM Added to PDA: {}", self.esim.key());
        Ok(())
    }
}
