import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
	return (
		<React.Fragment>
			<footer className="footer h-16 flex items-center justify-center px-6 bg-white shadow dark:bg-gray-800 mt-auto">
				<div className="flex justify-center items-center w-full gap-4">
					<div>
						{new Date().getFullYear()} © Dinefy -{' '}
						<Link to="https://coderthemes.com/" target="_blank">
							Vinasai Inc
						</Link>
					</div>

				</div>
			</footer>
		</React.Fragment>
	)
}

export default Footer
