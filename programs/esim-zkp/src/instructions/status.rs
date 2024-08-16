use anchor_lang::prelude::*;

use crate::states::ESIM;

#[derive(Accounts)]
#[instruction(address: String, phone_number: String)]
pub struct Status<'info> {
    #[account(mut, seeds = [user.key().as_ref(), address.as_ref(), phone_number.as_ref()], bump = esim.bump)]
    pub esim: Account<'info, ESIM>,
    #[account(mut)]
    pub user: Signer<'info>,
}

impl<'info> Status<'info> {
    pub fn set_status(&mut self, status: bool) -> Result<()> {
        self.esim.active = status;
        self.esim.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}
