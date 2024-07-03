'use client'
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"

import PrizePool from "@/components/PrizePool"
import CreatePrizePool from "./CreatePrizePool";

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CryptoKDO = () => {

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
       /* if(isSuccess){
            toast({
                title: "Prize Pool",
                description : prizePoolGet.owner
            });
        }else{
            toast({
                variant: "destructive",
                title: getError.name,
                description : getError.shortMessage
            });
        }*/
    }

    const func2 = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'createPrizePool',
            args: ["0xFe6f7252c10108f906fd5361baE6CC569bd0d07e",["0xFe6f7252c10108f906fd5361baE6CC569bd0d07e"]]
        })
    }

    const donate = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'donate',
            value: parseEther('0.003'),
            args: [0]
        })
    }

    const closePrizePool = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'closePrizePool',
            args: [0]
        })
    }

    return (
        <div className="flex flex-col justify-end">
        <div className="flex flex-row flex-wrap gap-3 m-3 justify-center">
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
          <PrizePool />
        </div>
        <Button onClick={func}>Get Prize Pool</Button>
        <Button onClick={func2}>Create Prize Pool</Button>
        <CreatePrizePool />
      </div>
    );
  }
  
  export default CryptoKDO;