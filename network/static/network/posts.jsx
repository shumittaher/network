

function Post_list() {
    
    const [posts, setPosts] = React.useState([]);

    fetch('/post_supply')
    .then(response=>response.json())
    .then(results=>setPosts(results))

    return (
        posts.map(post=>{
        <div>
            `${post}`
        </div>
        })
)
}

ReactDOM.render(<Post_list />, document.querySelector("#post_list"));