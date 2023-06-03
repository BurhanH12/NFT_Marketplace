import React from 'react'

const Footer = () => {
  return (
    
<footer className="bg-[#00061a] py-8">
  <div className="container mx-auto flex justify-between items-center">
    <div className="text-white font-serif text-xl tracking-wider">
      <h3 className="mb-2 text-gray-400 text-3xl">Artify</h3>
      <p className="text-xl">Where Art meets Technology</p>
    </div>
    <div className="text-gray-300 text-sm">
      <p className="mb-2">&copy; 2023 Qsols. All rights reserved.</p>
 <p>
        <a href="#" className="mr-4 hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="hover:text-gray-300">Terms of Service</a>
      </p>
    </div>
  </div>
</footer>


  )
}

export default Footer