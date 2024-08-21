use anchor_lang::prelude::*;

use crate::states::ESIM;

#[derive(Accounts)]
#[instruction(phone_number: String)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + ESIM::INIT_SPACE, seeds = [user.key().as_ref(), phone_number.as_ref()], bump)]
    pub esim: Account<'info, ESIM>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(
        &mut self,
        owner: Pubkey,
        phone_number: String,
        nullifier: String,
        active: bool,
        gender: u8,
        pincode: u32,
        state: String,
        bumps: &InitializeBumps,
    ) -> Result<()> {
        self.esim.owner = owner;
        self.esim.phone_number = phone_number;
        self.esim.nullifier = nullifier;
        self.esim.active = active;
        self.esim.gender = gender;
        self.esim.pincode = pincode;
        self.esim.state = state;
        self.esim.bump = bumps.esim;
        Ok(())
    }
}
