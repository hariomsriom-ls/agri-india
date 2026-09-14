"use client";
import {CiEdit} from "@/components/ui/icons";
import Card from "@/components/ui/customizable-cards";



type ProfileCardProps = {
  title: string;
  children: React.ReactNode;
  editable?: boolean;
  button?: React.ReactNode;
  onEdit?: () => void;
};

const ProfileCard = ({
  title,
  children,
  editable = false,
  button,
   onEdit,
}: ProfileCardProps) => {
     return (
        <Card className="border bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        {editable && (
          <button 
          onClick={onEdit}
          className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50">
            <CiEdit size={14} />
            Edit
          </button>
        )}

        {button}
      </div>

      <div>{children}</div>
    </Card>
  );
};

type EditableFieldProps = {
  label: string;
  value: string;
};


export { ProfileCard, };