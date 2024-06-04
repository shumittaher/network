if (document.querySelector("#post_list")) {
    ReactDOM.render(<Post_list />, document.querySelector("#post_list"));
}


if (document.querySelector("#post_list_follow")) {
    ReactDOM.render(<Post_list followed = {true} />, document.querySelector("#post_list_follow"));
}

function Post_list(params) {

    let {followed} = params
    
    const [page, setPage] = React.useState(1)
    const [posts, setPosts] = React.useState([]);
    const [last_page, setlast_page] = React.useState(false);
    
    React.useEffect(async () => {
        try {
            const response = await fetch(`/post_supply/${page}/${followed}/0`);
            const post = await response.json();
            setPosts(post.posts_dict);
            setlast_page(post.last_page);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
      
    }, [page]);

    let midpage = parseInt(page < 2 ? 2 : page)

    function changePage(event){

        const fetchpage = (event.target.dataset.page)
        if (fetchpage != 0) {
            setPage(fetchpage)
        }
    }
    
    return (

        <div className="border p-2 pt-0 row g-2 rounded mt-3">

            <h3 className="py-3 text-center text-primary shadow rounded"> {followed? "Followed Posts" :"All Posts"}</h3>

            {
                posts.length === 0 ? 
                <h6 className="text-center">Nothing to Show</h6>:
                posts.map((post,index) => <Post_item key={post.post_id} post={post} serial={index+1} />)
            }

            <nav aria-label="Page navigation">
            <ul onClick={(event)=>changePage(event)} className="justify-content-center pagination">
                <li class="page-item"><a class={`page-link ${page-1 === 0 ? 'disabled' : ''}`} data-page={page-1} href="#post_list">Previous</a></li>
                <li class="page-item"><a class="page-link" data-page={midpage-1} href="#post_list">{midpage-1}</a></li>
                <li class="page-item"><a class={`page-link ${last_page ? 'disabled' : ''}`} data-page={midpage} href="#post_list">{midpage}</a></li>
                <li class="page-item"><a class={`page-link ${last_page ? 'disabled' : ''}`} data-page={midpage+1} href="#post_list">{midpage+1}</a></li>
                <li class="page-item"><a class={`page-link ${last_page ? 'disabled' : ''}`} data-page={page+1}  href="#post_list">Next</a></li>
            </ul>
            </nav>
        </div>
    )
}

function Post_item(incoming) {

    const [post, setPost] = React.useState(incoming.post);
    const serial = incoming.serial
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
                <div className="d-flex justify-content-between">
                    <h2>{post.post_title}</h2><h2>{serial}</h2>
                </div>
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
                    temp_post = data.posts_dict[0]
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

