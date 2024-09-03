import { Button as FlowbiteButton, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const GradientButton = ({ type = 'button', children }) => (
  <button
    type={type}
    className='border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-4 py-2 transition duration-300'
  >
    {children}
  </button>
);

const SearchForm = ({ sidebarData, handleChange, handleSubmit }) => (
  <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
    <div className='flex items-center gap-2'>
      <label className='whitespace-nowrap font-semibold'>Search Term:</label>
      <TextInput
        placeholder='Search...'
        id='searchTerm'
        type='text'
        value={sidebarData.searchTerm}
        onChange={handleChange}
      />
    </div>
    <div className='flex items-center gap-2'>
      <label className='font-semibold'>Sort:</label>
      <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
        <option value='desc'>Latest</option>
        <option value='asc'>Oldest</option>
      </Select>
    </div>
    <div className='flex items-center gap-2'>
      <label className='font-semibold'>Category:</label>
      <Select onChange={handleChange} value={sidebarData.category} id='category'>
      
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
            <option value='MongoDB'>MongoDB</option>
            <option value='Express'>Express</option>
            <option value='CSS'>CSS</option>
            <option value='HTML'>HTML</option>
      </Select>
    </div>
    <GradientButton type='submit'>
      Apply Filters
    </GradientButton>
  </form>
);

const PostList = ({ posts, loading, showMore, handleShowMore }) => (
  <div className='p-7 flex flex-wrap gap-4'>
    {!loading && posts.length === 0 && (
      <p className='text-xl text-gray-500'>No posts found.</p>
    )}
    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
    {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
    {showMore && (
      <button
        onClick={handleShowMore}
        className='text-teal-500 text-lg hover:underline p-7 w-full'
      >
        Show More
      </button>
    )}
  </div>
);

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`https://api-alpha-fawn.vercel.app/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };
    fetchPosts();
  }, [location.search]);
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prevData => ({
      ...prevData,
      [id]: value || prevData[id]
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebarData);
    navigate(`/search?${urlParams.toString()}`);
  };
  
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfPosts);
    
    const res = await fetch(`https://api-alpha-fawn.vercel.app/api/post/getposts?${urlParams.toString()}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setPosts(prevPosts => [...prevPosts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <SearchForm
          sidebarData={sidebarData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <PostList
          posts={posts}
          loading={loading}
          showMore={showMore}
          handleShowMore={handleShowMore}
        />
      </div>
    </div>
  );
}
