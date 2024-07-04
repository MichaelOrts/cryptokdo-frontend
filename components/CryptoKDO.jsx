'use client'
import { useState, useEffect } from "react"

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"

import PrizePool from "@/components/PrizePool"
import CreatePrizePool from "./CreatePrizePool";

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CryptoKDO = () => {

    const [prizePools, setPrizePools] = useState([]);

    const { address } = useAccount();
    const { toast } = useToast()
    
    const { data: prizePoolGet, error: getError, isSuccess } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
    });

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        /* mutation: {
             onSuccess: () => {
 
             },
             onError: (error) => {
 
             }
         }*/
     })

    
    const getPrizePools = async() => {
        let done = false;
        let i = 0;
        let prizePoolsArray = [];
        while(!done){
            try{
                const data = await publicClient.readContract({
                    address: contractAddress,
                    abi: contractAbi,
                    functionName: 'getPrizePool',
                    args: [i]
                });
                prizePoolsArray.push(data);
                i++;
            } catch(error){
                done = true;
            }
        }
        setPrizePools(prizePoolsArray);
    }

    const func = async() => {
        try{
            const data = await publicClient.readContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: 'getPrizePool',
                args: [2]
            });
            toast({
                title: "Prize Pool",
                description : data.owner
            });
        } catch(error){
            toast({
                variant: "destructive",
                title: error.name,
                description : error.shortMessage
            });
        }
    }

    useEffect(() => {
        getPrizePools();
    }, [])

    return (
        <div className="flex flex-col justify-end gap-3">
            <div className="flex flex-row flex-wrap gap-3 m-3 justify-center">
                {prizePools.length > 0 && prizePools.map((prizePool, id) => {
                    return (
                        <PrizePool data={[prizePool, id]}/>
                    )
                })}
            </div>
            <Button onClick={func}>Get Prize Pool</Button>
            <CreatePrizePool />
      </div>
    );
  }
  
  export default CryptoKDO;