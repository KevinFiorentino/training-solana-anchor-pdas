use anchor_lang::prelude::*;

declare_id!("8WiX3pvaDXPppRY6vZqLgwkhs6pUoKQt9ycCFwq2rqVK");

#[program]
pub mod solana_movies {
    use super::*;
    pub fn add_movie(ctx: Context<AddMovie>, movie_name: String) -> Result<()> {
        let movie = &mut ctx.accounts.movie;

        movie.owner = ctx.accounts.user.key();
        movie.movie_name = movie_name;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(movie_name: String)]
pub struct AddMovie<'info> {
    #[account(
        init,
        seeds = [
            b"movie_account", user.key().as_ref(), movie_name.as_bytes()
        ],
        bump,
        payer = user,
        space = 8 + 32 + movie_name.as_bytes().len() + 4
    )]
    pub movie: Account<'info, Movie>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct Movie {
    pub owner: Pubkey,
    pub movie_name: String,
}
