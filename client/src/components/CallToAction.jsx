const { Button } = require('flowbite-react');

function CallToAction() {
  return (
    <section className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center max-w-screen-lg mx-auto'>
      <TextContent />
      <ImageContent />
    </section>
  );
}

function TextContent() {
  return (
    <div className="flex-1 flex flex-col justify-center p-4">
      <h2 className='text-2xl font-semibold mb-2'>
        Want to learn more about MERN?
      </h2>
      <p className='text-gray-500 mb-4'>
        Check out these resources from w3Schools
      </p>
      <a 
        href="https://www.w3schools.com/js/" 
        target='_blank' 
        rel='noopener noreferrer' 
        className='bg-gradient-to-r from-purple-400 to-pink-500 text-white py-2 px-4 rounded-tl-xl rounded-bl-none'>
        w3Schools
      </a>
    </div>
  );
}

function ImageContent() {
  return (
    <div className="p-7 flex-1">
      <img 
        src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" 
        alt="JavaScript overview" 
        className='w-full h-auto object-cover rounded-xl'
      />
    </div>
  );
}

module.exports = CallToAction;
