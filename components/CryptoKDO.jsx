'use client'
import { useState, useEffect } from "react"

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"

import PrizePool from "@/components/PrizePool"
import CreatePrizePool from "./CreatePrizePool";
import Dashboard from "./Dashboard";

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWatchContractEvent } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CryptoKDO = () => {

    const [prizePools, setPrizePools] = useState([]);
    const [totalPrizePools, setTotalPrizePools] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);

    const { address } = useAccount();
    const { toast } = useToast()
    
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

     useWatchContractEvent({
        address: contractAddress,
        abi: contractAbi,
        eventName: 'PrizePoolCreated',
        pollingInterval: 1_000,
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
        pollingInterval: 1_000,
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
        pollingInterval: 1_000,
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
            functionName: 'getTotalSupply',
        });
        setTotalSupply(supply);
    }

    const refetchCryptoKDO = async() => {
        getPrizePools();
        getTotalPrizePools();
        getTotalSupply();
    }

    useEffect(() => {
        refetchCryptoKDO();
    }, [])

    return (
        <div className="flex flex-col w-1/2 justify-end gap-3 m-3">
            <Dashboard totalPrizePools={totalPrizePools} totalSupply={totalSupply} />
            <div className="flex flex-row flex-wrap gap-3 m-3 justify-center">
                {prizePools.length > 0 && prizePools.map((prizePool, id) => {
                    return (
                        <PrizePool data={[prizePool, id]}/>
                    )
                })}
            </div>
            <Button onClick={getPrizePools}>Get Prize Pools</Button>
            <CreatePrizePool />
      </div>
    );
  }
  
  export default CryptoKDO;