
if (document.querySelector("#post_list")) {
    ReactDOM.render(<Post_list />, document.querySelector("#post_list"));
}

function Post_list() {
    
    const [posts, setPosts] = React.useState([]);
    
    React.useEffect(() => {
        fetch('/post_supply')
            .then(response=>response.json())
            .then(results=>setPosts(results))
    }, []);
    
    return (

        <div className="border p-2 pt-0 row g-2 rounded mt-5">

            {posts.map(post => <Post_item key={post.post_id} post={post}/>)}

        </div>
    )
}

function Post_item(incoming) {

    const [post, setPost] = React.useState(incoming.post);
    const likeButtonRef = React.useRef(null);

    let dateObject = new Date(post.post_timestamp);
    const formattedDate = dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
        });
    
    return <div className="column border rounded shadow p-4" key={post.post_id}>
            <h2>{post.post_title}</h2>
            <h6>
                <a href={`/profile/${post.poster_id}`} style={{textDecoration: 'none'}}>
                    {post.poster}
                </a>
            </h6>
            <h6>{formattedDate}</h6>
            <p className="mt-4">{post.post_text}</p>

            {(post.liked)? 
            <i ref={likeButtonRef} onClick={()=>like_handler(false)} class="fa-solid fa-thumbs-up fontawesome_icons text-primary"></i>:
            <i ref={likeButtonRef} onClick={()=>like_handler(true)} class="fa-regular fa-thumbs-up fontawesome_icons"></i>}
            
            <div className="post_count px-2 m-2">
                {post.likes_count}
            </div> 

            </div>


    function like_handler(enable_like) {

        let temp_post
        let animation_running = true
        likeButtonRef.current.classList.add('animation_like_click');

        likeButtonRef.current.addEventListener('animationend', animation_end)

        function animation_end() {

            likeButtonRef.current.classList.remove('animation_like_click');

            animation_running = false
            likeButtonRef.current.removeEventListener('animationend', animation_end)
            setTempPostToPost()
        }

        fetch('/like_route', {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify({
                'post_id' : post.post_id,
                'enable' : enable_like
            })
        }).then(response => {if (response.status == 200) {
             
                fetch(`/fetch_post/${post.post_id}`)
                .then(response => response.json())
                .then(data=>{
                    temp_post = data[0]
                    if (!animation_running){
                        setTempPostToPost()
                    }
                })
            }
        })
        
        function setTempPostToPost() {
            
            if (temp_post){
                setPost(temp_post)
                temp_post = null}
            }

    }
}

