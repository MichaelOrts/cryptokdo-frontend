'use client'
import { useState, useEffect } from "react"

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"

import PrizePool from "@/components/PrizePool"
import CreatePrizePool from "./CreatePrizePool";
import Dashboard from "./Dashboard";

import { publicClientHardhat, publicClientSepolia } from "@/utils/client";
import { contractAddressHardhat, contractAddressSepolia, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWatchContractEvent, useWatchBlocks } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CryptoKDO = () => {

    const [prizePools, setPrizePools] = useState([]);
    const [totalPrizePools, setTotalPrizePools] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [reward, setReward] = useState(0);
    const [lastWinner, setLastWinner] = useState(0);
    const [lotteryTime, setLotteryTime] = useState(0);
    const [publicClient, setPublicClient] = useState(publicClientSepolia);
    const [contractAddress, setContractAddress] = useState(contractAddressSepolia)
    const [refetch, setRefetch] = useState(true)
    const [timestamp, setTimestamp] = useState(0)

    const { address, chain } = useAccount();
    const { toast } = useToast();

    /*useEffect(() => {
        const id = setInterval( () => {
          setRefetch(true)
        }, 5000);
      }, []);*/
    
    const { data: prizePoolGet, error: getError, isSuccess } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
    });

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        mutation: {
            onSuccess: () => {
 
            },
            onError: (error) => {
                toast({
                    title: error.name,
                    description: error.message,
                    className: "bg-red-200"
                })
            }
        }
     })

     const showPrizePoolCreated = (args) => {
        return (
            <div>
                <p>id : {args.id.toString()}</p>
                <p>title : {args.title}</p>
                <p>description : {args.description}</p>
                <p>owner : {args.owner}</p>
                <p>receiver : {args.receiver}</p>
                <p>givers :</p>
                {args.givers.map(giver => {
                    return (<p>{giver}</p>)
                })}
            </div>
        )
     }

     const showDonationDone = (args) => {
        return (
            <div>
                <p>id : {args.id.toString()}</p>
                <p>giver : {args.giver}</p>
                <p>amount : {formatEther(args.amount.toString())}</p>
            </div>
        )
     }

     const showPrizePoolClosed = (args) => {
        return (
            <div>
                <p>title : {args.title}</p>
                <p>description : {args.description}</p>
                <p>owner : {args.owner}</p>
                <p>receiver : {args.receiver}</p>
                <p>givers :</p>
                {args.givers.map(giver => {
                    return (<p>{giver}</p>)
                })}
                <p>amount : {formatEther(args.amount.toString())}</p>
            </div>
        )
     }

     const showWinningPrizePool = (args) => {
        return (
            <div>
                <p>id : {args.id}</p>
                <p>reward : {args.reward}</p>
            </div>
        )
     }

     useWatchContractEvent({
        address: contractAddress,
        abi: contractAbi,
        eventName: 'PrizePoolCreated',
        poll : true,
        onLogs(logs) {
            logs.map(log => {
                toast({
                    title: "PrizePoolCreated",
                    description: showPrizePoolCreated(log.args),
                    className: "bg-lime-200"
                })
            });
            refetchCryptoKDO();
        }
      })

      useWatchContractEvent({
        address: contractAddress,
        abi: contractAbi,
        eventName: 'DonationDone',
        poll : true,
        onLogs(logs) {
            logs.map(log => {
                toast({
                    title: "DonationDone",
                    description: showDonationDone(log.args),
                    className: "bg-lime-200"
                })
            });
            refetchCryptoKDO();
        }
      })

      useWatchContractEvent({
        address: contractAddress,
        abi: contractAbi,
        eventName: 'PrizePoolClosed',
        poll : true,
        onLogs(logs) {
            logs.map(log => {
                toast({
                    title: "PrizePoolClosed",
                    description: showPrizePoolClosed(log.args.prizePool),
                    className: "bg-lime-200"
                })
            });
            refetchCryptoKDO();
        }
      })

      useWatchBlocks({
        poll : true,
        onBlock(block) {
          setTimestamp(Number(block.timestamp) * 1000);
          refetchCryptoKDO();
        },
      })

      
    
    const getPrizePools = async() => {
        const prizePoolsArray = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'getAllPrizePools',
        });
        setPrizePools(prizePoolsArray);
    }

    const getTotalPrizePools = async() => {
        const total = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'getTotalPrizePools',
        });
        setTotalPrizePools(total);
    }

    const getTotalSupply = async() => {
        const supply = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'currentSupply',
        });
        setTotalSupply(supply);
    }

    const getReward = async() => {
        const currentReward = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'reward',
        });
        setReward(currentReward);
    }

    const getLastWinner = async() => {
        const winner = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'winningPrizePoolId',
        });
        setLastWinner(winner);
    }

    const getLotteryTime = async() => {
        const lotteryTimestamp = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'lastLotteryTimestamp',
        });
        setLotteryTime(Number(lotteryTimestamp) * 1000);
    }

    const updateRewards = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'updateRewards'
        })
        refetchCryptoKDO();
    }

    const refetchCryptoKDO = async() => {
        getPrizePools();
        getTotalPrizePools();
        getTotalSupply();
        getReward();
        getLastWinner();
        getLotteryTime();
    }

    useEffect(() => {
        setPublicClient(chain?.name === "Hardhat" ? publicClientHardhat : publicClientSepolia)
        setContractAddress(chain?.name === "Hardhat" ? contractAddressHardhat : contractAddressSepolia)
    }, [chain])

    useEffect(() => {
        if(refetch){
            refetchCryptoKDO();
            setRefetch(false);
        }
    }, [publicClient, refetch])

    return (
        <div className="flex flex-col w-1/2 justify-end gap-3 m-3">
            <Dashboard totalPrizePools={totalPrizePools} totalSupply={totalSupply} reward={reward} lastWinner={lastWinner} lotteryCounter={(Number(lotteryTime) + 774000000 - Number(timestamp))} />
            <div className="flex flex-row flex-stretch gap-3 m-3 justify-center">
                {prizePools.length > 0 && prizePools.map((prizePool, id) => {
                    return (
                        <PrizePool data={[prizePool, id, lastWinner == id]}/>
                    )
                })}
            </div>
            <Button onClick={updateRewards}>Refetch</Button>
            <CreatePrizePool />
      </div>
    );
  }
  
  export default CryptoKDO;