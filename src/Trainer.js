import React, {useEffect, useRef, useState} from "react";
import {AppBar, Box, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import moment from "moment";
import twophase from './lib/twophase'
import algUtil from './lib/algUtil'

const Trainer = (props) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '700px'
        },
        box: {
            marginBottom: '10px'
        },
        scrambleBlock: {
            backgroundColor: '#dddddd'
        },
        imageBlock: {
            backgroundColor: '#eeeeee'
        },
        timerBlock: {
            backgroundColor: '#ededed'
        },
        timeListBlock: {
            backgroundColor: '#dddddd'
        }
    }))
    const classes = useStyles()

    const intervalRef = useRef(null);
    const [time, setTime] = useState(0); // センチ秒
    const [algList, setAlgList] = useState([])
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeList, setTimeList] = useState([])
    const [scramble, setScramble] = useState("")

    useEffect(() => {
        twophase.initialize()
        if (props.location.state) {
            setAlgList(props.location.state.algList)
        } else {
            props.history.push("/")
        }
        startGame(props.location.state.algList)
    }, [])

    document.onkeydown = (event) => {
        if (event.keyCode === 32) {
            if (isTimerRunning) { // ソルブ中
                endGame()
                setIsTimerRunning(false)
            } else { // 停止中
                setTime(0)
                startTimer()
                setIsTimerRunning(true)
            }
        }
    }

    const onTouchTimerView = (event) => {
        if (isTimerRunning) { // ソルブ中
            endGame()
            setIsTimerRunning(false)
        } else { // 停止中
            setTime(0)
            startTimer()
            setIsTimerRunning(true)
        }
    }

    const startGame = (list) => {
        const algIndex = Math.floor(Math.random() * list.length)
        setScramble(twophase.solve(algUtil.makeRotationlessAlg(list[algIndex])))
    }

    const endGame = () => {
        stopTimer()
        const timeListTmp = timeList.slice()
        if (time / 100 / 60 < 1) {
            timeListTmp.push(moment(time * 10).format('s.SS'))
        } else {
            timeListTmp.push(moment(time * 10).format('m:ss.SS'))
        }
        setTimeList(timeListTmp)
        startGame(algList)
    }

    const startTimer = () => {
        if (intervalRef.current !== null) return;
        intervalRef.current = setInterval(() => {
            setTime(c => c + 1);
        }, 10);
    }

    const stopTimer = () => {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>Alg Trainer</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box className={classes.box} display={"flex"} justifyContent={"space-between"}>
                    <Button variant='contained' onClick={() => props.history.push({
                        pathname: "/",
                        state: {
                            algList: algList
                        }
                    })}>
                        戻る
                    </Button>
                </Box>
                <Typography className={classes.box}>
                    スタート/ストップ方法<br/>
                    PC: スペースキー押下<br/>
                    スマホ: タイマー部分タップ
                </Typography>
                <Box className={classes.scrambleBlock} display={"flex"} justifyContent={"center"}>
                    <Typography>
                        Scramble: {scramble}
                    </Typography>
                </Box>
                <Box display={"flex"}>
                    <Box className={classes.imageBlock} display={"flex"}>
                        <img
                            src={"http://cube.rider.biz/visualcube.php?fmt=png&r=x-30y30z15&bg=t&size=150&pzl=3&alg=" + scramble.replace(/\s+/g, "")}/>
                    </Box>
                    <Box className={classes.timerBlock}
                         display={"flex"}
                         justifyContent={"center"}
                         alignItems={"center"}
                         flexGrow={1}
                         onTouchStart={onTouchTimerView}>
                        <Typography variant={"h4"}>
                            {moment(time * 10).format('mm:ss.SS')}
                        </Typography>
                    </Box>
                </Box>
                <Box className={classes.timeListBlock} display={"flex"}>
                    <Typography>
                        Time List:
                    </Typography>
                </Box>
                <Box className={classes.timeListBlock} display={"flex"}>
                    <Typography>
                        &nbsp; {timeList.join(", ")}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default Trainer