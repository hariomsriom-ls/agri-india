"use client"
import { MdDashboardCustomize, MdOutlineAdd, MdPendingActions, MdOutlineRequestPage, MdOutlineSyncProblem,
    MdOutlinePolicy, MdOutlineMessage, MdNotifications, MdOutlineChat, MdReviews,MdOutlineFileUpload,
    MdOutlineSearch, MdCancel } from "react-icons/md";
import { LuLandPlot, LuCalendarDays,LuChevronDown,LuChevronLeft,LuChevronRight,LuEye,LuFileText,LuIndianRupee,
     LuLayers, LuMapPin, LuPencil, LuPlus, LuSearch, LuSprout, LuUserRound, LuX,   LuBellRing,
     LuCalendarCheck,LuCheckCheck,LuClipboardCheck,LuFileChartColumn,LuFileSearch, LuHistory, LuNotebookText, 
     LuPaperclip, LuRefreshCw,LuSearchCheck,LuSend, LuShieldCheck, LuSparkles, LuSquarePen, LuUserRoundPlus, 
      LuArrowLeft,LuCalendarClock,LuCircleCheck,LuDownload,LuEllipsisVertical,LuFileSpreadsheet,LuImage,
      LuMapPinned,LuSlidersHorizontal,LuSmile,  LuArrowUp,LuCircleAlert,LuFilePlus,LuFilter,
      LuFolderOpen,LuMessageCircle, LuArrowRight,LuChartNoAxesColumnIncreasing,LuHardHat,LuMegaphone,
       LuTriangleAlert,LuUserRoundCheck,LuCircleX,LuClock3,LuTrash2, LuArrowDown,LuBan,LuEllipsis,
       LuExpand,LuShare2,LuUpload,LuUsersRound, LuBell,LuCheck,LuExternalLink,LuFlag,LuMail,LuSettings,
     LuBuilding2, LuCamera,LuFileClock,LuKeyRound,LuLanguages,LuLockKeyhole, LuMonitor, LuPalette,LuPhone,
     LuSave,LuUserRoundCog, LuBriefcaseBusiness,LuHourglass,  LuUserRoundX, LuDroplets, LuLeaf,  LuCalendar,
  LuCircleCheckBig,LuFilePlus2,LuGraduationCap,LuHeadphones, LuTractor,LuArrowUpDown,
  LuShield,} 
     from "react-icons/lu";
import { GiPayMoney,  GiPlantWatering, GiWallet, GiWheat} from "react-icons/gi";
import { VscLayersActive,  VscOrganization } from "react-icons/vsc";
import { ImHistory } from "react-icons/im";
import { IoDocumentsSharp, IoHomeOutline, IoLocationSharp, IoBriefcaseSharp } from "react-icons/io5";
import { FaRegUserCircle, FaUserCheck, FaCheckCircle } from "react-icons/fa";
import { GrProjects, GrAnalytics, GrDocumentVerified, GrUserWorker } from "react-icons/gr";
import { FcViewDetails } from "react-icons/fc";
import { RiExchangeBoxFill, RiPassPendingFill, RiVerifiedBadgeFill } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { GoReport, GoShieldLock } from "react-icons/go";
import { FiEye,FiEyeOff,FiMessageSquare,FiShield,FiShoppingCart, FiUsers,  FiBarChart2, FiCheck, FiChevronDown,
  FiClock, FiList, FiMic, FiPaperclip, FiPlus, FiSend, FiSettings,FiAlertCircle,FiCheckCircle,FiChevronRight,
  FiFileText,FiPlusCircle, FiUser, FiCalendar,FiChevronLeft,FiFilter,FiInfo,FiSearch, FiDownload,  FiFile,
  FiTool, FiSmile,FiStar,
  FiMoreVertical,FiPhone,FiUploadCloud,FiX,FiXCircle,FiGrid, FiMapPin,FiBell,FiMail,} from "react-icons/fi";
import { PiPlant } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc"
import { FaUser } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { HiOutlineCurrencyRupee, HiOutlineMegaphone  } from "react-icons/hi2";



export {
    MdDashboardCustomize,LuLandPlot,MdOutlineAdd,GiPayMoney, GrUserWorker,MdCancel,MdOutlineFileUpload,
    MdOutlineRequestPage,VscLayersActive,ImHistory,IoDocumentsSharp, MdNotifications, IoLocationSharp,
    MdOutlineChat, MdReviews, FaRegUserCircle,GrProjects,MdOutlineSearch, VscOrganization,IoBriefcaseSharp,
    MdOutlineMessage,FcViewDetails,RiExchangeBoxFill,MdPendingActions,RiPassPendingFill,GrDocumentVerified,
    FaUserCheck,MdOutlineSyncProblem,TbReport, GoReport, GrAnalytics, MdOutlinePolicy,IoHomeOutline,FaCheckCircle,
    FiEye,FiEyeOff,FiMessageSquare,FiShield,FiShoppingCart, FcGoogle , PiPlant, FiUsers, FaUser, RiVerifiedBadgeFill,
    CiEdit, GoShieldLock,  LuCalendarDays, LuChevronDown, LuChevronLeft, LuChevronRight, LuEye, LuFileText, 
    LuIndianRupee, LuLayers, LuMapPin, LuPencil, LuPlus, LuSearch, LuSprout, LuUserRound, LuX, LuBellRing,
     LuCalendarCheck,LuCheckCheck,LuClipboardCheck,LuFileChartColumn,LuFileSearch, LuHistory, LuNotebookText, 
     LuPaperclip, LuRefreshCw,LuSearchCheck,LuSend, LuShieldCheck, LuSparkles, LuSquarePen, LuUserRoundPlus,
     LuArrowLeft,LuCalendarClock,LuCircleCheck,LuDownload,LuEllipsisVertical,LuFileSpreadsheet,LuImage,
      LuMapPinned,LuSlidersHorizontal,LuSmile, LuArrowUp,LuCircleAlert,LuFilePlus,LuFilter,
      LuFolderOpen,LuMessageCircle, LuArrowRight,LuChartNoAxesColumnIncreasing,LuHardHat,LuMegaphone,
       LuTriangleAlert,LuUserRoundCheck, LuCircleX,LuClock3,LuTrash2, LuArrowDown,LuBan,LuEllipsis,
       LuExpand,LuShare2,LuUpload,LuUsersRound, LuBell,LuCheck,LuExternalLink,LuFlag,LuMail,LuSettings,
       LuBuilding2, LuCamera,LuFileClock,LuKeyRound,LuLanguages,LuLockKeyhole, LuMonitor, LuPalette,LuPhone,
     LuSave,LuUserRoundCog,LuBriefcaseBusiness,LuHourglass,LuUserRoundX,  FiBarChart2, FiCheck, FiChevronDown,
  FiClock, FiList, FiMic, FiPaperclip, FiPlus, FiSend, FiSettings, LuDroplets, LuLeaf, GiPlantWatering,
  HiOutlineCurrencyRupee, FiAlertCircle,FiCheckCircle,FiChevronRight,FiCalendar,FiChevronLeft,FiFilter,FiInfo,FiSearch,
  FiFileText,FiPlusCircle, FiUser, GiWallet, FiDownload,FiMoreVertical,FiPhone,FiUploadCloud,FiX,FiXCircle,GiWheat,
   FiGrid, FiMapPin,FiBell,FiMail,HiOutlineMegaphone,  FiFile,FiSmile,FiStar, LuCalendar,
  LuCircleCheckBig,LuFilePlus2,LuGraduationCap,LuHeadphones, LuTractor,LuArrowUpDown, LuShield,
  FiTool,
};