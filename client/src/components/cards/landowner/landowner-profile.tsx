"use client";
import {CiEdit} from "@/components/ui/icons";
import Card from "@/components/ui/customizable-cards";



type ProfileCardProps = {
  title: string;
  children: React.ReactNode;
  editable?: boolean;
  button?: React.ReactNode;
};

const ProfileCard = ({
  title,
  children,
  editable = false,
  button,
}: ProfileCardProps) => {
     return (
        <Card className="border bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        {editable && (
          <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50">
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


const EditableField = ({
  label,
  value,
}: EditableFieldProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-500">{label}</span>

      <div className="flex items-center gap-5">
        <span className="text-sm font-medium text-gray-800">
          {value}
        </span>

        <button className="text-xs font-medium text-green-600 hover:text-green-700">
          Change
        </button>
      </div>
    </div>
  );
};

export { ProfileCard, EditableField };