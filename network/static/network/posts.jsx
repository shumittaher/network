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
                
                return <div className="column border rounded shadow p-4" key={post.post_id}>
                        <h2>{post.post_title}</h2>
                        <h6>{post.poster}</h6>
                        <h6>{formattedDate}</h6>
                        <p className="mt-4">{post.post_text}</p>

                        <i class="fa-solid fa-thumbs-up"></i>
                        <i class="fa-regular fa-thumbs-up"></i>
                        
                        <i class="fa-solid fa-user"></i>
                                            
                        </div>
            })}

        </div>
    )
}

ReactDOM.render(<Post_list />, document.querySelector("#post_list"));