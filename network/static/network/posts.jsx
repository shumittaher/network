function Post_list() {
    
    const [posts, setPosts] = React.useState([]);
    
    React.useEffect(() => {
        fetch('/post_supply')
            .then(response=>response.json())
            .then(results=>setPosts(results))
    }, []);
    
    return (

        <div className="border p-2 pt-0 row g-2 rounded mt-5">

            {posts.map(post => {

                let dateObject = new Date(post.post_timestamp);
                const formattedDate = dateObject.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  });

                console.log(post.likes)
                
                return <div className="column border rounded shadow p-4" key={post.post_id}>
                        <h2>{post.post_title}</h2>
                        <h6>{post.poster}</h6>
                        <h6>{formattedDate}</h6>
                        <p className="mt-4">{post.post_text}</p>

                        <i onClick={()=>like_handler(post.post_id, false)} class="fa-solid fa-thumbs-up fontawesome_icons"></i>

                        <i onClick={()=>like_handler(post.post_id, true)} class="fa-regular fa-thumbs-up fontawesome_icons"></i>
                                            
                        </div>
            })}

        </div>
    )
}

ReactDOM.render(<Post_list />, document.querySelector("#post_list"));

function like_handler(post_id, enable_like) {
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
    }).then(response=>console.log(response))
}