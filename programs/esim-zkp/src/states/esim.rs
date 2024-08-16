use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ESIM {
    #[max_len(128)]
    pub address: String,
    #[max_len(13)]
    pub phone_number: String,
    #[max_len(80)]
    pub nullifier: String,
    pub active: bool,
    pub gender: u8,
    pub pincode: u32,
    #[max_len(30)]
    pub state: String,
    pub updated_at: i64,
    pub bump: u8,
}
