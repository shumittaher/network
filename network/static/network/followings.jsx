
if (document.querySelector("#follow_grid")) {
    ReactDOM.render(<Follow_grid />, document.querySelector("#follow_grid"));
}

function Follow_grid() {

    const [followerRefresh, setFollowerRefresh] = React.useState(true);
       
    return <div>

        <div class="d-flex justify-content-center my-4">
            <Follow_button setFollowerRefresh ={setFollowerRefresh}/>
        </div>
        
        <div className="row mb-2">
            <div className="col text-end">
                <h6>
                    {profile_name}'s Followers 
                </h6>
            </div>
            <div className="col">
                <h6>
                    {profile_name} Follows
                </h6>
            </div>
        </div>

        <div className="row">
            <div className="col text-end">
                <Followers followerRefresh={followerRefresh} setFollowerRefresh = {setFollowerRefresh}/>
            </div>
            <div className="col">
                <Followees/>
            </div>

        </div>

    </div>
}

function Follow_button(params) {

    const [followButtonStatus, setFollowButtonStatus] = React.useState(i_follow === 'True'? true:false);
   
    let {setFollowerRefresh} = params

    function follow_button_clicked(event) {
        
        send_follow(event.target, setFollowButtonStatus, setFollowerRefresh)
        
    }
    
    return <button 
            data-action={followButtonStatus?"False":"True"} 
            onClick={(event)=>follow_button_clicked(event)} 
            className={followButtonStatus?"py-3 btn btn-primary": "py-3 btn btn-outline-primary"} 
            style={{width: "10em"}}>
            {followButtonStatus? "Unfollow" : "Follow" }
        </button>

}

function Followees() {

    const [followees, setfollowees] = React.useState([]);

    React.useEffect(() => {
        fetch_followers(profile_id, 'False', setfollowees)
    }, []);

    return <div>
            
            {
                followees.map((follower)=>(
                        <h6>{follower.followed}</h6>
                    ))
            }

        </div>
}

function Followers(params) {

    let {followerRefresh, setFollowerRefresh} = params

    const [followers, setfollowers] = React.useState([]);

    React.useEffect(() => {
            if (followerRefresh) {
            fetch_followers(profile_id, 'True', setfollowers)
            setFollowerRefresh(false)
        }
    }, [followerRefresh]);
    
    return <div>
            
            {
                followers.map((follower)=>(
                        <h6>{follower.follower}</h6>
                    ))
            }

        </div>
}   


async function fetch_followers(profile_id, followers, setFunction) {

    const response = await fetch(`/followers_supply/${profile_id}/${followers}`)
    const data = await response.json()

    setFunction(data)
}

async function send_follow(follow_button, setFollowButtonStatus, setFollowerRefresh) {

    const response = await fetch('/follow_route', {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf
        },
        body: JSON.stringify({
            'user_id' : profile_id,
            'follow' : follow_button.dataset.action==='True'
        })
    })

    const message = await response.json()
    if (message.status == 'Followed'){
        setFollowButtonStatus(true)
    } else if (message.status == 'un-Followed'){
        setFollowButtonStatus(false)
    }

    setFollowerRefresh(true)
}

