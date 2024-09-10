import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=20');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
    if (currentUser.isAdmin || currentUser.isWriter) {
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
      arc: {
        borderWidth: 2,
      },
      line: {
        borderWidth: 2,
      },
    },
  };

  const userData = {
    labels: ['Total Users', 'Last Month Users'],
    datasets: [
      {
        label: 'Users',
        data: [totalUsers, lastMonthUsers],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const postData = {
    labels: ['Total Posts', 'Last Month Posts'],
    datasets: [
      {
        label: 'Posts',
        data: [totalPosts, lastMonthPosts],
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const commentData = {
    labels: ['Total Comments', 'Last Month Comments'],
    datasets: [
      {
        label: 'Comments',
        data: [totalComments, lastMonthComments],
        backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        {currentUser.isAdmin && (
          <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
              <div>
                <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                <p className='text-2xl'>{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp />
                {lastMonthUsers}
              </span>
              <div className='text-gray-500'>Last month</div>
            </div>
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
              <Bar data={userData} options={chartOptions} />
            </div>
          </div>
        )}
        {(currentUser.isAdmin || currentUser.isWriter) && (
          <>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div>
                  <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                  <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  <HiArrowNarrowUp />
                  {lastMonthComments}
                </span>
                <div className='text-gray-500'>Last month</div>
              </div>
              <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Doughnut data={commentData} options={chartOptions} />
              </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div>
                  <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                  <p className='text-2xl'>{totalPosts}</p>
                </div>
                <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  <HiArrowNarrowUp />
                  {lastMonthPosts}
                </span>
                <div className='text-gray-500'>Last month</div>
              </div>
              <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Line data={postData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
      {(currentUser.isAdmin || currentUser.isWriter) && (
        <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
          {currentUser.isAdmin && (
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent users</h1>
                <Button outline gradientDuoTone='purpleToPink'>
                  <Link to={'/dashboard?tab=users'}>See all</Link>
                </Button>
              </div>
              <div className='overflow-auto' style={{ maxHeight: '300px' }}>
                <Table hoverable className='shadow-md rounded-md'>
                  <Table.Head>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                      User image
                    </Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                      Username
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className='divide-y'>
                    {users.map((user) => (
                      <Table.Row key={user._id} className='bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt='user'
                            className='w-10 h-10 rounded-full bg-gray-500 border border-gray-300 dark:border-gray-600'
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          )}
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>Recent comments</h1>
              <Button outline gradientDuoTone='purpleToPink'>
                <Link to={'/dashboard?tab=comments'}>See all</Link>
              </Button>
            </div>
            <div className='overflow-auto' style={{ maxHeight: '300px' }}>
              <Table hoverable className='shadow-md rounded-md'>
                <Table.Head>
                  <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                    Comment content
                  </Table.HeadCell>
                  <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                    Likes
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                  {comments.map((comment) => (
                    <Table.Row key={comment._id} className='bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>
                      <Table.Cell className='w-96'>
                        <p className='line-clamp-2'>{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
              <h1 className='text-center p-2'>Recent posts</h1>
              <Button outline gradientDuoTone='purpleToPink'>
                <Link to={'/dashboard?tab=posts'}>See all</Link>
              </Button>
            </div>
            <div className='overflow-auto' style={{ maxHeight: '300px' }}>
              <Table hoverable className='shadow-md rounded-md'>
                <Table.Head>
                  <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                    Post image
                  </Table.HeadCell>
                  <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                    Post Title
                  </Table.HeadCell>
                  <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                    Category
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                  {posts.map((post) => (
                    <Table.Row key={post._id} className='bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt='post'
                          className='w-14 h-10 rounded-md bg-gray-500 border border-gray-300 dark:border-gray-600'
                        />
                      </Table.Cell>
                      <Table.Cell className='w-96'>{post.title}</Table.Cell>
                      <Table.Cell className='w-5'>{post.category}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
