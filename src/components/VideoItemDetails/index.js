import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import {AiOutlineLike, AiOutlineDislike} from 'react-icons/ai'
import {BiListPlus} from 'react-icons/bi'
import {
  LoaderContainer,
  VideoDetailsContainer,
  VideoContentContainer,
  PlayerAndVideoDetailsContainer,
  ReactPlayerContainer,
  Description,
  DynamicDataContainer,
  DynamicDataStyling,
  LeftDynamicContainer,
  RightDynamicContainer,
  ProfileContainer,
  Profile,
  ChannelNameViewCountAndPublishedStyling,
  Title,
  Button,
  DetailsContainer,
  AboutContainer,
  HorizontalLine,
} from './styledComponents'
import ThemeContext from '../../context/ThemeContext'
import Header from '../Header'
import './index.css'
import SideBar from '../SideBar'
import FailureView from '../FailureView'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const VideoItemDetails = props => {
  const [videoDetails, setVideoDetails] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [isLike, setIsLike] = useState(false)
  const [isDisLike, setDisLike] = useState(false)
  const [isSaved, setSaved] = useState(false)

  const fetchVideoData = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const {match} = props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedVideoDetails = {
        id: data.video_details.id,
        title: data.video_details.title,
        publishedAt: data.video_details.published_at,
        thumbnailUrl: data.video_details.thumbnail_url,
        viewCount: data.video_details.view_count,
        videoUrl: data.video_details.video_url,
        description: data.video_details.description,
        channelName: data.video_details.channel.name,
        profileImageUrl: data.video_details.channel.profile_image_url,
        subscriberCount: data.video_details.channel.subscriber_count,
      }

      setVideoDetails(updatedVideoDetails)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    fetchVideoData()
  }, [])

  const renderPlayer = () => (
    <ReactPlayerContainer>
      <ReactPlayer
        url={videoDetails.videoUrl}
        controls
        width="100%"
        height="70vh"
      />
    </ReactPlayerContainer>
  )

  const renderLoader = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  const renderVideoDetailsOnSuccess = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme, saveVideoButtonClicked} = value
        const likeIconClassName = isLike ? 'selected' : 'not-selected'
        const dislikeIconClassName = isDisLike ? 'selected' : 'not-selected'
        const saveButtonIconClassName = isSaved ? 'selected' : 'not-selected'
        const saveButtonText = isSaved ? 'Saved' : 'Save'

        const onSaveButtonClicked = () => {
          setSaved(previous => !previous)

          saveVideoButtonClicked({
            videoDetails,
          })
        }

        const onLikeButtonClicked = () => {
          setIsLike(true)
          setDisLike(false)
        }

        const onDislikeButtonClicked = () => {
          setIsLike(false)
          setDisLike(true)
        }

        return (
          <PlayerAndVideoDetailsContainer>
            {renderPlayer()}
            <Description darkMode={isDarkTheme}>
              {videoDetails.description}
            </Description>
            <DynamicDataContainer>
              <LeftDynamicContainer>
                <DynamicDataStyling darkMode={isDarkTheme}>
                  {videoDetails.viewCount}
                </DynamicDataStyling>
                <DynamicDataStyling darkMode={isDarkTheme}>
                  {videoDetails.publishedAt}
                </DynamicDataStyling>
              </LeftDynamicContainer>
              <RightDynamicContainer>
                <AiOutlineLike
                  className={`icon-in-video-item ${likeIconClassName}`}
                />
                <Button
                  active={isLike}
                  style={{color: '#64748b'}}
                  onClick={onLikeButtonClicked}
                >
                  Like
                </Button>

                <AiOutlineDislike
                  className={`icon-in-video-item ${dislikeIconClassName}`}
                />
                <Button
                  active={isDisLike}
                  style={{color: '#64748b'}}
                  onClick={onDislikeButtonClicked}
                >
                  Dislike
                </Button>

                <BiListPlus
                  className={`icon-in-video-item ${saveButtonIconClassName} `}
                />
                <Button
                  onClick={onSaveButtonClicked}
                  className={saveButtonIconClassName}
                >
                  {saveButtonText}
                </Button>
              </RightDynamicContainer>
            </DynamicDataContainer>
            <HorizontalLine />
            <DetailsContainer>
              <ProfileContainer>
                <Profile
                  src={videoDetails.profileImageUrl}
                  alt="channel logo"
                />
              </ProfileContainer>
              <AboutContainer>
                <Title darkMode={isDarkTheme}>{videoDetails.title}</Title>
                <ChannelNameViewCountAndPublishedStyling>
                  {videoDetails.channelName}
                </ChannelNameViewCountAndPublishedStyling>
                <DynamicDataContainer>
                  <ChannelNameViewCountAndPublishedStyling>
                    {videoDetails.subscriberCount}
                  </ChannelNameViewCountAndPublishedStyling>
                </DynamicDataContainer>
              </AboutContainer>
            </DetailsContainer>
          </PlayerAndVideoDetailsContainer>
        )
      }}
    </ThemeContext.Consumer>
  )

  const retryButtonClicked = () => {
    fetchVideoData()
  }

  let renderBasedOnApiStatus

  switch (apiStatus) {
    case apiStatusConstants.failure:
      renderBasedOnApiStatus = (
        <FailureView retryButtonClicked={retryButtonClicked()} />
      )
      break
    case apiStatusConstants.success:
      renderBasedOnApiStatus = renderVideoDetailsOnSuccess()
      break
    case apiStatusConstants.inProgress:
      renderBasedOnApiStatus = renderLoader()
      break
    default:
      renderBasedOnApiStatus = ''
  }

  return (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value

        return (
          <>
            <Header />
            <VideoDetailsContainer
              darkMode={isDarkTheme}
              data-testid="videoItemDetails"
            >
              <SideBar />
              <VideoContentContainer>
                {renderBasedOnApiStatus}
              </VideoContentContainer>
            </VideoDetailsContainer>
          </>
        )
      }}
    </ThemeContext.Consumer>
  )
}

export default VideoItemDetails
