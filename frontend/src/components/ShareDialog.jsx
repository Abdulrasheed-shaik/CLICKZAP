import React from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const ShareDialog = ({ open, setOpen, suggestedUsers, selectedUser, setSelectedUser, postId }) => {
  return (
    <Dialog
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSelectedUser(null); // Reset selected user when dialog is closed
      }}
    >
      <DialogContent className='mobile:w-[90%]'>
        <DialogTitle>Share</DialogTitle>
        <div className='flex items-center gap-1 flex-wrap mobile:gap-[1px]'>
          {suggestedUsers.map((share) => (
            <div 
              className={`p-2 w-fit flex flex-col items-center m-1 border ${selectedUser === share?._id ? 'border-blue-500' : 'border-transparent'} rounded-md cursor-pointer`} 
              key={share?._id}
              onClick={() => setSelectedUser(share?._id)} // Set selected user
            >
              <Avatar className='w-10 h-10 relative'>
                <AvatarImage src={share?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
                {selectedUser === share?._id && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full p-1">
                    <Check size={12} />
                  </span>
                )}
              </Avatar>
              <span className='font-semibold text-sm mobile:text-xs'>{share?.username}</span>
            </div>
          ))}
        </div>
        {selectedUser && (
          <Button 
            className='mt-4 w-full' 
            onClick={() => {
              toast.success(`Post ${postId} sent successfully!`); // Use postId in the success message
              setOpen(false); // Close dialog after sending
              setSelectedUser(null); // Reset selection
            }}
          >
            Send
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
