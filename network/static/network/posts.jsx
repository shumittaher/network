ReactDOM.render(<Post_list />, document.querySelector("#post_list"));

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
            <h6>{post.poster}</h6>
            <h6>{formattedDate}</h6>
            <p className="mt-4">{post.post_text}</p>

            {(post.liked)? 
            <i onClick={()=>like_handler(post.post_id, false, setPost, post)} class="fa-solid fa-thumbs-up fontawesome_icons"></i>:
            <i onClick={()=>like_handler(post.post_id, true, setPost, post)} class="fa-regular fa-thumbs-up fontawesome_icons"></i>}

            </div>
}

function like_handler(post_id, enable_like, setPost, post) {
    fetch('/like_route', {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf
        },
        body: JSON.stringify({
            'post_id' : post_id,
            'enable' : enable_like
        })
    }).then(response => {if (response.status == 200) {

            const new_like_status = !post.liked
            const changed_post = ({...post, liked: new_like_status})

            setPost(changed_post)
        }
    })
}