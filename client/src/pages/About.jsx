export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Mern' Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Mern's Blog! This blog was created by Team Blogger
              as a group project . 
            </p>

            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages.
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
