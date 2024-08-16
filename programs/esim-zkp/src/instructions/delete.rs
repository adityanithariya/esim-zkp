use anchor_lang::prelude::*;

use crate::states::ESIM;

#[derive(Accounts)]
#[instruction(address: String, phone_number: String)]
pub struct Delete<'info> {
    #[account(mut, close = user, seeds = [user.key().as_ref(), address.as_ref(), phone_number.as_ref()], bump = esim.bump)]
    pub esim: Account<'info, ESIM>,
    #[account(mut)]
    pub user: Signer<'info>,
}
