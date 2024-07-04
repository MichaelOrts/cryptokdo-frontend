import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CreatePrizePool = () => {

    const [receiver, setReceiver] = useState('');
    const [currentGiver, setCurrentGiver] = useState('');
    const [givers, setGivers] = useState([]);

    const { address } = useAccount();

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        /* mutation: {
             onSuccess: () => {
 
             },
             onError: (error) => {
 
             }
         }*/
     })

     const createPrizePool = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'createPrizePool',
            args: [receiver,givers]
        })
    }

    const handleAddGiver = () => {
        let newGivers = givers.slice();
        newGivers.push(currentGiver);
        setGivers(newGivers);
        setCurrentGiver('');
    }

    const handleRemoveGiver = (id) => {
        let newGivers = givers.slice();
        newGivers.splice(id,1);
        setGivers(newGivers);
    }

    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create Prize Pool</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex items-center">
              <DialogTitle>Create Prize Pool</DialogTitle>
              <DialogDescription>
                Create new Prize Pool. Click create when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receiver" className="text-left">
                  Receiver
                </Label>
                <Input id="receiver" defaultValue="" className="col-span-3" value={receiver} onChange={ e => setReceiver(e.target.value)} />
              </div>
              <Label htmlFor="givers" className="text-center font-bold">
                  Givers
                </Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="giver" className="text-left">
                  Giver
                </Label>
                <Input id="giver" defaultValue="" className="col-span-3" value={currentGiver} onChange={ e => setCurrentGiver(e.target.value)} />
              </div>
              <div>
                {givers.length > 0 && givers.map((giver, id) => {
                    return (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-left col-span-3">{giver}</Label>
                            <Button className="col-span-1" onClick={e => handleRemoveGiver(id)}>Remove</Button>
                        </div>
                    )
                })}
              </div>
              <Button onClick={handleAddGiver}>Add Giver</Button>
            </div>
            <DialogFooter>
              <DialogClose type="submit" onClick={createPrizePool}>Create</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
  }
  
  export default CreatePrizePool;
  