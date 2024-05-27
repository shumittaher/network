function Post_list() {
    
    const [posts, setPosts] = React.useState([]);
    
    React.useEffect(() => {
        fetch('/post_supply')
            .then(response=>response.json())
            .then(results=>setPosts(results))
    }, []);
    
    console.log(posts)
    
    return (
        <div>

            {posts.map(post => {

            return <div key={post.id || post._id}>
                <h2>{post.post_title}</h2>
                <p>{post.post_text}</p>
            </div>

        })}
        </div>
    )
}

ReactDOM.render(<Post_list />, document.querySelector("#post_list"));
