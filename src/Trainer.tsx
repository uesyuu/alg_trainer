import React, {useEffect, useRef, useState} from "react";
import {AppBar, Box, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import moment from "moment";
import twoPhase from './lib/twophase'
import algUtil from './lib/algUtil'
import {RouteComponentProps} from "react-router-dom";
import {RouterState} from "./types/routerState";

const Trainer = (props: RouteComponentProps) => {
    const useStyles = makeStyles(() => ({
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
        timeListTitleBlock: {
            backgroundColor: '#dddddd'
        },
        timeListBlock: {
            backgroundColor: '#dddddd',
            height: "250px",
            overflow: "scroll",
        }
    }))
    const classes = useStyles()

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [time, setTime] = useState(0); // センチ秒
    const [algList, setAlgList] = useState(Array<string>())
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeList, setTimeList] = useState(Array<string>())
    const [scramble, setScramble] = useState("")

    useEffect(() => {
        twoPhase.initialize()
        if (props.location.state) {
            const algListInState = props.location.state as RouterState
            setAlgList(algListInState.algList)
            startGame(algListInState.algList)
        } else {
            props.history.push("/")
        }
    }, [props.history, props.location.state])

    document.onkeydown = (event) => {
        if (event.code === "Space") {
            operateGame()
        }
    }

    const onTouchTimerView = () => {
        operateGame()
    }

    const operateGame = () => {
        if (isTimerRunning) { // ソルブ中
            endGame()
            setIsTimerRunning(false)
        } else { // 停止中
            setTime(0)
            startTimer()
            setIsTimerRunning(true)
        }
    }

    const startGame = (list: Array<string>) => {
        const algIndex = Math.floor(Math.random() * list.length)
        const [newRotationLessSolutionList, newRotationList] = algUtil.makeRotationLessAlg(list[algIndex].split(" "))
        setScramble(twoPhase.solve(newRotationLessSolutionList.join(" ")))
    }

    const endGame = () => {
        stopTimer()
        if (time / 100 / 60 < 1) {
            setTimeList([
                ...timeList,
                moment(time * 10).format('s.SS')
            ])
        } else {
            setTimeList([
                ...timeList,
                moment(time * 10).format('m:ss.SS')
            ])
        }
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
                            src={"https://cubing.net/api/visualcube/?fmt=svg&r=x-30y30z15&bg=t&size=150&pzl=3&alg=" + scramble.replace(/\s+/g, "")}
                            alt={""}
                        />
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
                <Box className={classes.timeListTitleBlock} display={"flex"}>
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
