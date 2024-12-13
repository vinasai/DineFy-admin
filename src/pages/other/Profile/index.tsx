import { useEffect, useState } from 'react'
import Chart, { type ChartItem } from 'chart.js/auto'
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

//image
import avatar1 from '@/assets/images/users/avatar-1.jpg'

// dummy data
import { productConfig } from './data'

const ProfilePages = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const history = useNavigate();

    const PopoverToggle = () => <i className="ri-more-2-fill" />

    useEffect(() => {
        const productTag = document.getElementById('high-performing-product') as ChartItem
        const chart = new Chart(productTag, productConfig)

        return () => {
            chart.destroy()
        }
    }, [])

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative">
                            {/* Cover Image */}
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-red-600"></div>
                            
                            {/* Profile Image */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <img 
                                    src={avatar1} 
                                    alt="Profile" 
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="pt-16 pb-8 px-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">Nipun Perera</h2>
                            <p className="text-gray-500 mt-1">Admin</p>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-center gap-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={handleOpenModal}>
                                    Edit Profile
                                </button>
                                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition" onClick={() => history('/auth/recover-password')}>
                                    Change Password
                                </button>
                            </div>

                            {/* Profile Details */}
                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center border-b border-gray-100 pb-4">
                                    <span className="font-medium text-gray-600 w-1/3">Full Name:</span>
                                    <span className="text-gray-800">Nipun Perera</span>
                                </div>
                                <div className="flex items-center border-b border-gray-100 pb-4">
                                    <span className="font-medium text-gray-600 w-1/3">Email:</span>
                                    <span className="text-gray-800">admin@dinefy.com</span>
                                </div>
                                <div className="flex items-center border-b border-gray-100 pb-4">
                                    <span className="font-medium text-gray-600 w-1/3">Phone:</span>
                                    <span className="text-gray-800">+1 (123) 456-7890</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
<Modal
    open={isModalOpen}
    onClose={handleCloseModal}
    aria-labelledby="edit-profile-modal-title"
    aria-describedby="edit-profile-modal-description"
>
    <Box 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg"
        sx={{ width: '80%', maxWidth: '600px' }} // Adjust the width here
    >
        <h2 id="edit-profile-modal-title" className="text-xl font-bold mb-4">Edit Profile</h2>
        {/* Add your form fields here */}
        <form>
            <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" defaultValue="Nipun Perera" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded" defaultValue="admin@email.com" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input type="tel" className="w-full px-3 py-2 border rounded" defaultValue="+1 (123) 456-7890" />
            </div>
            <div className="flex justify-end">
                <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition" onClick={handleCloseModal}>
                    Cancel
                </button>
                <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Save
                </button>
            </div>
        </form>
    </Box>
</Modal>
        </div>
    )
}

export default ProfilePages