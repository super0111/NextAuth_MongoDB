import React, { Component, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'




export default function VideoJs(props) {
  const playerRef = useRef();

  //Player Config
  const [allValues, setAllValues] = useState({
    url: props.url,
    pip: false,
    playing: props.playing,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played:0,
    loaded:0,
    duration:0,
    playbackRate: 1.0,
    loop: false,
    seeking: false
    });



  const load = (url) => {
    setAllValues( prevValues => {
      return { ...prevValues,url: url}
      })
    setAllValues( prevValues => {
      return { ...prevValues,played: 0}
      })
    setAllValues( prevValues => {
        return { ...prevValues,loaded: 0}
      })
    setAllValues( prevValues => {
      return { ...prevValues, pip: false}
      })
  }

  const handlePlayPause = () => {
    setAllValues( prevValues => {
      return { ...prevValues, playing: !allValues.playing}
      })
  }

  const handleStop = () => {
    setUrl(null);
    setAllValues( prevValues => {
      return { ...prevValues, url: null}
      })
    setAllValues( prevValues => {
      return { ...prevValues, playing: false}
      })
  }

  const handleToggleControls = () => {
    const url = allValues.url
    setAllValues( prevValues => {
      return { ...prevValues, controls: !allValues.controls}
    })

    setAllValues( prevValues => {
      return { ...prevValues, url: null}
    }).then(() => load(url));   
    
  }

  const handleToggleLight = () => {
    setAllValues( prevValues => {
      return { ...prevValues, light: !allValues.light}
    })
  }

  const handleToggleLoop = () => {
     setAllValues( prevValues => {
      return { ...prevValues, loop: !allValues.loop}
    })
  }

  const handleVolumeChange = (e) => {
    setAllValues( prevValues => {
      return { ...prevValues, volume: parseFloat(e.target.value)}
    })
  }

  const handleToggleMuted = () => {
    setAllValues( prevValues => {
      return { ...prevValues, muted: !allValues.muted}
    })
  }

  const handleSetPlaybackRate = e => {
    setAllValues( prevValues => {
      return { ...prevValues, playbackRate: parseFloat(e.target.value)}
    })
  }

  const handleOnPlaybackRateChange = (speed) => {
    setAllValues( prevValues => {
      return { ...prevValues, playbackRate: parseFloat(speed)}
    })
  }

  const handleTogglePIP = () => {
    setAllValues( prevValues => {
      return { ...prevValues, pip: !allValues.pip}
    })
  }

  const handlePlay = () => {
    console.log('onPlay')
    setAllValues( prevValues => {
      return { ...prevValues, playing: true}
    })
  }

  const handleEnablePIP = () => {
    console.log('onEnablePIP')
    setAllValues( prevValues => {
      return { ...prevValues, pip: true}
    })
  }

  const handleDisablePIP = () => {
    console.log('onDisablePIP')
    setAllValues( prevValues => {
      return { ...prevValues, pip: false}
    })
  }

  const handlePause = () => {
    console.log('onPause')
    setAllValues( prevValues => {
      return { ...prevValues, playing: false}
    })
  }

  const handleSeekMouseDown = e => {
    setAllValues( prevValues => {
      return { ...prevValues, seeking: true}
    })
  }

  const handleSeekChange = e => {
    setAllValues( prevValues => {
      return { ...prevValues, played: parseFloat(e.target.value)}
    })
  }

  const handleSeekMouseUp = e => {
    setAllValues( prevValues => {
      return { ...prevValues, seeking: false}
    })
    playerRef.current.seekTo(parseFloat(e.target.value))
  }

  const handleProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!allValues.seeking) {
      setAllValues(allValues)
    }
  }

  const handleEnded = () => {
    console.log('onEnded')
    setAllValues( prevValues => {
      return { ...prevValues, playing: allValues.loop}
    })
  }

  const handleDuration = (duration) => {
    console.log('onDuration', duration)
    setAllValues( prevValues => {
      return { ...prevValues, duration: duration}
    })
    // this.setState({ duration })
  }

  // const handleClickFullscreen = () => {
  //   screenfull.request(findDOMNode(this.player))
  // }
  useEffect(() => {
   if(playerRef.current.getInternalPlayer('hls') !== null){
     setAllValues({controls: false})
   }
  }, [playerRef])

    return (
          <div className='relative'>
            <ReactPlayer
              ref={playerRef}
              width='100%'
              height="100%"
              url={props.url}
              playing={props.playing}
              pip={allValues.pip}
              controls={allValues.controls}
              light={allValues.light}
              loop={allValues.loop}
              playbackRate={allValues.playbackRate}
              volume={allValues.volume}
              muted={allValues.muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={handlePlay}
              onEnablePIP={handleEnablePIP}
              onDisablePIP={handleDisablePIP}
              onPause={handlePause}
              onBuffer={() => console.log('onBuffer')}
              onPlaybackRateChange={handleOnPlaybackRateChange}
              onSeek={e => console.log('onSeek', e)}
              onEnded={handleEnded}
              onError={e => console.log('onError', e)}
              onProgress={handleProgress}
              onDuration={handleDuration}
            />
             {/* <ReactPlayer  width="100%"  
                        controls={true} 
                        playing={props.playing}  
                        url={props.url} 
                        onBuffer={() => {console.log('Buffering')}}
                        onBufferEnd={() => {console.log('Buffering Ended')}}
                        onError={(e) => { console.log('error',e)}}
                    /> */}
          </div>
      
    )
}

