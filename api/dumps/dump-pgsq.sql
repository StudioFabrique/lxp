--
-- PostgreSQL database dump
--

\restrict aOBvXN1egEY71FFSLzy720xdHkgjcWb7Zr00cTwdazcPRnHPePWH02sqAax07k3

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Accomplishment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Accomplishment" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "accomplishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "hasBeenCongratulated" boolean DEFAULT false NOT NULL,
    "studentId" integer NOT NULL,
    "showToOtherStudent" boolean DEFAULT false NOT NULL,
    "courseId" integer
);


ALTER TABLE public."Accomplishment" OWNER TO postgres;

--
-- Name: Accomplishment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Accomplishment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Accomplishment_id_seq" OWNER TO postgres;

--
-- Name: Accomplishment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Accomplishment_id_seq" OWNED BY public."Accomplishment".id;


--
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id integer NOT NULL,
    title text,
    type text NOT NULL,
    "order" integer NOT NULL,
    url text NOT NULL,
    "lessonId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" integer NOT NULL
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Activity_id_seq" OWNER TO postgres;

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Activity_id_seq" OWNED BY public."Activity".id;


--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    "idMdb" text NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Admin_id_seq" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: Authorization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Authorization" (
    id integer NOT NULL,
    role text NOT NULL,
    action text NOT NULL,
    resource text NOT NULL
);


ALTER TABLE public."Authorization" OWNER TO postgres;

--
-- Name: Authorization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Authorization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Authorization_id_seq" OWNER TO postgres;

--
-- Name: Authorization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Authorization_id_seq" OWNED BY public."Authorization".id;


--
-- Name: BonusActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BonusActivity" (
    id integer NOT NULL,
    title text,
    type text NOT NULL,
    "order" integer NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adminId" integer NOT NULL,
    "resourceId" integer NOT NULL
);


ALTER TABLE public."BonusActivity" OWNER TO postgres;

--
-- Name: BonusActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BonusActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BonusActivity_id_seq" OWNER TO postgres;

--
-- Name: BonusActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BonusActivity_id_seq" OWNED BY public."BonusActivity".id;


--
-- Name: BonusSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BonusSkill" (
    id integer NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    badge text,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."BonusSkill" OWNER TO postgres;

--
-- Name: BonusSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BonusSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BonusSkill_id_seq" OWNER TO postgres;

--
-- Name: BonusSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BonusSkill_id_seq" OWNED BY public."BonusSkill".id;


--
-- Name: BonusSkillsOnModuleMetadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BonusSkillsOnModuleMetadata" (
    "bonusSkillId" integer NOT NULL,
    "moduleId" integer NOT NULL
);


ALTER TABLE public."BonusSkillsOnModuleMetadata" OWNER TO postgres;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    "idMdb" text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    email text,
    phone text DEFAULT 'Non renseigné'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contact" OWNER TO postgres;

--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contact_id_seq" OWNER TO postgres;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: ContactsOnCourse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactsOnCourse" (
    "contactId" integer NOT NULL,
    "courseId" integer NOT NULL
);


ALTER TABLE public."ContactsOnCourse" OWNER TO postgres;

--
-- Name: ContactsOnModuleMetadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactsOnModuleMetadata" (
    "contactId" integer NOT NULL,
    "moduleId" integer NOT NULL
);


ALTER TABLE public."ContactsOnModuleMetadata" OWNER TO postgres;

--
-- Name: ContactsOnParcours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactsOnParcours" (
    "parcoursId" integer NOT NULL,
    "contactId" integer NOT NULL
);


ALTER TABLE public."ContactsOnParcours" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    image bytea,
    "moduleId" integer NOT NULL,
    "virtualClass" text,
    visibility boolean,
    scenario boolean DEFAULT true NOT NULL,
    dates jsonb[],
    "order" integer NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL,
    "adminId" integer NOT NULL,
    "courseSlug" text
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: Course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Course_id_seq" OWNER TO postgres;

--
-- Name: Course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Course_id_seq" OWNED BY public."Course".id;


--
-- Name: Formation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Formation" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    code text,
    level text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adminId" integer NOT NULL
);


ALTER TABLE public."Formation" OWNER TO postgres;

--
-- Name: Formation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Formation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Formation_id_seq" OWNER TO postgres;

--
-- Name: Formation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Formation_id_seq" OWNED BY public."Formation".id;


--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id integer NOT NULL,
    "idMdb" text NOT NULL
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Group_id_seq" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Group_id_seq" OWNED BY public."Group".id;


--
-- Name: GroupsOnParcours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupsOnParcours" (
    "groupId" integer NOT NULL,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."GroupsOnParcours" OWNER TO postgres;

--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lesson" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    modalite text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL,
    "adminId" integer NOT NULL,
    "courseId" integer NOT NULL,
    "tagId" integer NOT NULL,
    "order" integer NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    visibility boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Lesson" OWNER TO postgres;

--
-- Name: LessonRating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonRating" (
    id integer NOT NULL,
    rating integer NOT NULL,
    "lessonId" integer NOT NULL,
    "studentId" integer NOT NULL
);


ALTER TABLE public."LessonRating" OWNER TO postgres;

--
-- Name: LessonRating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LessonRating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LessonRating_id_seq" OWNER TO postgres;

--
-- Name: LessonRating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LessonRating_id_seq" OWNED BY public."LessonRating".id;


--
-- Name: LessonRead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonRead" (
    id integer NOT NULL,
    "beganAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastOpenedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finishedAt" timestamp(3) without time zone,
    "lessonId" integer NOT NULL,
    "studentId" integer NOT NULL
);


ALTER TABLE public."LessonRead" OWNER TO postgres;

--
-- Name: LessonRead_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LessonRead_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LessonRead_id_seq" OWNER TO postgres;

--
-- Name: LessonRead_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LessonRead_id_seq" OWNED BY public."LessonRead".id;


--
-- Name: Lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Lesson_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Lesson_id_seq" OWNER TO postgres;

--
-- Name: Lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Lesson_id_seq" OWNED BY public."Lesson".id;


--
-- Name: Mediatheque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mediatheque" (
    id integer NOT NULL,
    type text NOT NULL,
    url text NOT NULL,
    name text NOT NULL,
    "authorId" integer NOT NULL,
    size integer NOT NULL,
    used integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Mediatheque" OWNER TO postgres;

--
-- Name: Mediatheque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mediatheque_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mediatheque_id_seq" OWNER TO postgres;

--
-- Name: Mediatheque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mediatheque_id_seq" OWNED BY public."Mediatheque".id;


--
-- Name: Module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Module" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    image bytea,
    thumb bytea,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL,
    "adminId" integer NOT NULL,
    "quizInstructions" text
);


ALTER TABLE public."Module" OWNER TO postgres;

--
-- Name: ModuleMetadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ModuleMetadata" (
    id integer NOT NULL,
    duration integer,
    rating double precision,
    "minDate" timestamp(3) without time zone,
    "maxDate" timestamp(3) without time zone,
    "moduleId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adminId" integer NOT NULL,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."ModuleMetadata" OWNER TO postgres;

--
-- Name: ModuleMetadata_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ModuleMetadata_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ModuleMetadata_id_seq" OWNER TO postgres;

--
-- Name: ModuleMetadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ModuleMetadata_id_seq" OWNED BY public."ModuleMetadata".id;


--
-- Name: Module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Module_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Module_id_seq" OWNER TO postgres;

--
-- Name: Module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Module_id_seq" OWNED BY public."Module".id;


--
-- Name: ModulesOnFormation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ModulesOnFormation" (
    "moduleId" integer NOT NULL,
    "formationId" integer NOT NULL
);


ALTER TABLE public."ModulesOnFormation" OWNER TO postgres;

--
-- Name: Objective; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Objective" (
    id integer NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."Objective" OWNER TO postgres;

--
-- Name: Objective_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Objective_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Objective_id_seq" OWNER TO postgres;

--
-- Name: Objective_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Objective_id_seq" OWNED BY public."Objective".id;


--
-- Name: OpenBadge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OpenBadge" (
    id integer NOT NULL,
    creator text NOT NULL,
    image bytea NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OpenBadge" OWNER TO postgres;

--
-- Name: OpenBadge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OpenBadge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OpenBadge_id_seq" OWNER TO postgres;

--
-- Name: OpenBadge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OpenBadge_id_seq" OWNED BY public."OpenBadge".id;


--
-- Name: Parcours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Parcours" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone DEFAULT date_trunc('day'::text, (now() + '1 day'::interval)),
    "endDate" timestamp(3) without time zone DEFAULT date_trunc('day'::text, (now() + '2 mons'::interval)),
    degree text,
    image bytea,
    thumb bytea,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL,
    visibility boolean DEFAULT false NOT NULL,
    "adminId" integer NOT NULL,
    "formationId" integer NOT NULL,
    "virtualClass" text,
    "isPublished" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Parcours" OWNER TO postgres;

--
-- Name: Parcours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Parcours_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Parcours_id_seq" OWNER TO postgres;

--
-- Name: Parcours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Parcours_id_seq" OWNED BY public."Parcours".id;


--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quiz" (
    id integer NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    "moduleId" integer,
    "activityId" integer,
    "courseId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "studentId" integer
);


ALTER TABLE public."Quiz" OWNER TO postgres;

--
-- Name: QuizQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizQuestion" (
    id integer NOT NULL,
    "externalId" text,
    type text NOT NULL,
    difficulty text DEFAULT 'medium'::text NOT NULL,
    prompt text NOT NULL,
    "explanationTrue" text,
    "explanationWrong" text,
    tags text[],
    data jsonb NOT NULL,
    "contentHash" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "quizId" integer
);


ALTER TABLE public."QuizQuestion" OWNER TO postgres;

--
-- Name: QuizQuestionReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizQuestionReport" (
    id integer NOT NULL,
    "quizQuestionId" integer,
    commentaire text
);


ALTER TABLE public."QuizQuestionReport" OWNER TO postgres;

--
-- Name: QuizQuestionReport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."QuizQuestionReport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."QuizQuestionReport_id_seq" OWNER TO postgres;

--
-- Name: QuizQuestionReport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."QuizQuestionReport_id_seq" OWNED BY public."QuizQuestionReport".id;


--
-- Name: QuizQuestion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."QuizQuestion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."QuizQuestion_id_seq" OWNER TO postgres;

--
-- Name: QuizQuestion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."QuizQuestion_id_seq" OWNED BY public."QuizQuestion".id;


--
-- Name: Quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Quiz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Quiz_id_seq" OWNER TO postgres;

--
-- Name: Quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Quiz_id_seq" OWNED BY public."Quiz".id;


--
-- Name: Resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resource" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL,
    "adminId" integer NOT NULL,
    "imageUrl" text
);


ALTER TABLE public."Resource" OWNER TO postgres;

--
-- Name: ResourceActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ResourceActivity" (
    id integer NOT NULL,
    label text NOT NULL,
    "order" integer NOT NULL,
    url text NOT NULL,
    "activityId" integer NOT NULL
);


ALTER TABLE public."ResourceActivity" OWNER TO postgres;

--
-- Name: ResourceActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ResourceActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ResourceActivity_id_seq" OWNER TO postgres;

--
-- Name: ResourceActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ResourceActivity_id_seq" OWNED BY public."ResourceActivity".id;


--
-- Name: ResourceBonusActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ResourceBonusActivity" (
    id integer NOT NULL,
    label text NOT NULL,
    "order" integer NOT NULL,
    url text NOT NULL,
    "bonusActivityId" integer NOT NULL
);


ALTER TABLE public."ResourceBonusActivity" OWNER TO postgres;

--
-- Name: ResourceBonusActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ResourceBonusActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ResourceBonusActivity_id_seq" OWNER TO postgres;

--
-- Name: ResourceBonusActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ResourceBonusActivity_id_seq" OWNED BY public."ResourceBonusActivity".id;


--
-- Name: Resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resource_id_seq" OWNER TO postgres;

--
-- Name: Resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Resource_id_seq" OWNED BY public."Resource".id;


--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id integer NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    badge text
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: Skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Skill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skill_id_seq" OWNER TO postgres;

--
-- Name: Skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Skill_id_seq" OWNED BY public."Skill".id;


--
-- Name: SkillsOnParcours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillsOnParcours" (
    "skillId" integer NOT NULL,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."SkillsOnParcours" OWNER TO postgres;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id integer NOT NULL,
    "idMdb" text NOT NULL
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Student_id_seq" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id integer NOT NULL,
    name text NOT NULL,
    color text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tag_id_seq" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tag_id_seq" OWNED BY public."Tag".id;


--
-- Name: TagsOnCourse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TagsOnCourse" (
    "tagId" integer NOT NULL,
    "courseId" integer NOT NULL
);


ALTER TABLE public."TagsOnCourse" OWNER TO postgres;

--
-- Name: TagsOnFormation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TagsOnFormation" (
    "tagId" integer NOT NULL,
    "formationId" integer NOT NULL
);


ALTER TABLE public."TagsOnFormation" OWNER TO postgres;

--
-- Name: TagsOnParcours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TagsOnParcours" (
    "tagId" integer NOT NULL,
    "parcoursId" integer NOT NULL
);


ALTER TABLE public."TagsOnParcours" OWNER TO postgres;

--
-- Name: TagsOnResources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TagsOnResources" (
    "tagId" integer NOT NULL,
    "resourceId" integer NOT NULL
);


ALTER TABLE public."TagsOnResources" OWNER TO postgres;

--
-- Name: Teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Teacher" (
    id integer NOT NULL,
    "idMdb" text NOT NULL
);


ALTER TABLE public."Teacher" OWNER TO postgres;

--
-- Name: Teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Teacher_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Teacher_id_seq" OWNER TO postgres;

--
-- Name: Teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Teacher_id_seq" OWNED BY public."Teacher".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Accomplishment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accomplishment" ALTER COLUMN id SET DEFAULT nextval('public."Accomplishment_id_seq"'::regclass);


--
-- Name: Activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN id SET DEFAULT nextval('public."Activity_id_seq"'::regclass);


--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Name: Authorization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authorization" ALTER COLUMN id SET DEFAULT nextval('public."Authorization_id_seq"'::regclass);


--
-- Name: BonusActivity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusActivity" ALTER COLUMN id SET DEFAULT nextval('public."BonusActivity_id_seq"'::regclass);


--
-- Name: BonusSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkill" ALTER COLUMN id SET DEFAULT nextval('public."BonusSkill_id_seq"'::regclass);


--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: Course id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course" ALTER COLUMN id SET DEFAULT nextval('public."Course_id_seq"'::regclass);


--
-- Name: Formation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation" ALTER COLUMN id SET DEFAULT nextval('public."Formation_id_seq"'::regclass);


--
-- Name: Group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public."Group_id_seq"'::regclass);


--
-- Name: Lesson id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson" ALTER COLUMN id SET DEFAULT nextval('public."Lesson_id_seq"'::regclass);


--
-- Name: LessonRating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRating" ALTER COLUMN id SET DEFAULT nextval('public."LessonRating_id_seq"'::regclass);


--
-- Name: LessonRead id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRead" ALTER COLUMN id SET DEFAULT nextval('public."LessonRead_id_seq"'::regclass);


--
-- Name: Mediatheque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mediatheque" ALTER COLUMN id SET DEFAULT nextval('public."Mediatheque_id_seq"'::regclass);


--
-- Name: Module id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module" ALTER COLUMN id SET DEFAULT nextval('public."Module_id_seq"'::regclass);


--
-- Name: ModuleMetadata id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModuleMetadata" ALTER COLUMN id SET DEFAULT nextval('public."ModuleMetadata_id_seq"'::regclass);


--
-- Name: Objective id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Objective" ALTER COLUMN id SET DEFAULT nextval('public."Objective_id_seq"'::regclass);


--
-- Name: OpenBadge id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenBadge" ALTER COLUMN id SET DEFAULT nextval('public."OpenBadge_id_seq"'::regclass);


--
-- Name: Parcours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parcours" ALTER COLUMN id SET DEFAULT nextval('public."Parcours_id_seq"'::regclass);


--
-- Name: Quiz id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz" ALTER COLUMN id SET DEFAULT nextval('public."Quiz_id_seq"'::regclass);


--
-- Name: QuizQuestion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestion" ALTER COLUMN id SET DEFAULT nextval('public."QuizQuestion_id_seq"'::regclass);


--
-- Name: QuizQuestionReport id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestionReport" ALTER COLUMN id SET DEFAULT nextval('public."QuizQuestionReport_id_seq"'::regclass);


--
-- Name: Resource id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource" ALTER COLUMN id SET DEFAULT nextval('public."Resource_id_seq"'::regclass);


--
-- Name: ResourceActivity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceActivity" ALTER COLUMN id SET DEFAULT nextval('public."ResourceActivity_id_seq"'::regclass);


--
-- Name: ResourceBonusActivity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceBonusActivity" ALTER COLUMN id SET DEFAULT nextval('public."ResourceBonusActivity_id_seq"'::regclass);


--
-- Name: Skill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill" ALTER COLUMN id SET DEFAULT nextval('public."Skill_id_seq"'::regclass);


--
-- Name: Student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);


--
-- Name: Tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN id SET DEFAULT nextval('public."Tag_id_seq"'::regclass);


--
-- Name: Teacher id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Teacher" ALTER COLUMN id SET DEFAULT nextval('public."Teacher_id_seq"'::regclass);


--
-- Data for Name: Accomplishment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Accomplishment" (id, name, description, "accomplishedAt", "hasBeenCongratulated", "studentId", "showToOtherStudent", "courseId") FROM stdin;
1	jacqueline fillipini	vient de terminer la leçon Présentation	2026-06-12 09:36:51.969	f	1	t	1
2	jacqueline fillipini	vient d'attribuer une note de 5 sur 5 à la leçon Présentation	2026-06-12 09:36:52.001	f	1	f	1
4	jacqueline fillipini	vient d'attribuer une note de 1 sur 5 à la leçon Référentiel	2026-06-12 09:37:12.293	f	1	f	1
3	jacqueline fillipini	vient de terminer la leçon Référentiel	2026-06-12 09:37:12.265	t	1	t	1
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, title, type, "order", url, "lessonId", "createdAt", "updatedAt", "authorId") FROM stdin;
1	Dossier de conception	text	0	00eee561-f517-4a7f-b0f0-e631eba6510f1781254867934.html	1	2026-06-12 09:01:07.936	2026-06-12 09:01:07.936	1
2	Dossier de l'application développé	text	1	75160679-d7ce-456a-b7b6-f9791bcd50eb1781254867968.html	1	2026-06-12 09:01:07.97	2026-06-12 09:01:07.97	1
3	Dossier technique	text	2	5fbd20f3-b750-46b6-8bc9-c967424388dc1781254867998.html	1	2026-06-12 09:01:08	2026-06-12 09:01:08	1
4	Synthèse du référentiel	text	0	c8641e43-1cba-454d-ae62-3628fb19de9e1781254868035.html	2	2026-06-12 09:01:08.037	2026-06-12 09:01:08.037	1
5	Outils d'aide à la conception	text	0	c4b3bafe-6108-45b9-b967-aa14f4b8ccba1781254868063.html	3	2026-06-12 09:01:08.064	2026-06-12 09:01:08.064	1
6	Plan de sécurité informatique	text	0	1252b96b-f40c-4216-a698-b2413c6490361781254868080.html	4	2026-06-12 09:01:08.081	2026-06-12 09:01:08.081	1
7	Plan de maintenance	text	1	cd7da310-3442-478d-a547-4e11623f20051781254868099.html	4	2026-06-12 09:01:08.101	2026-06-12 09:01:08.101	1
8	Définition	text	0	3bc3e61b-5e3f-46ff-8abf-3324548177b21781254868219.html	5	2026-06-12 09:01:08.221	2026-06-12 09:01:08.221	1
9	Le code ne raconte pas toute l'histoire	text	1	2767040f-3a4f-4e9b-9dfa-35b1bf0d55c81781254868306.html	5	2026-06-12 09:01:08.308	2026-06-12 09:01:08.308	1
10	Pourquoi s'intéresser à l'architecture logicielle?	text	0	0d087b4f-6180-4f3b-b373-6c7238bc45821781254868351.html	6	2026-06-12 09:01:08.352	2026-06-12 09:01:08.352	1
11	Pourquoi une bonne conception d'architecture logicielle est cruciale ?	text	1	5212a35e-ddc6-47a7-9f86-c529bcd1c83c1781254868387.html	6	2026-06-12 09:01:08.389	2026-06-12 09:01:08.389	1
12	Les attributs de qualité	text	0	64542013-d60d-4f54-bb9a-512cffb53c5f1781254868418.html	7	2026-06-12 09:01:08.42	2026-06-12 09:01:08.42	1
13	Exigences fonctionnelles principales	text	1	be9f940d-9831-4a17-a401-c3c735d876281781254868450.html	7	2026-06-12 09:01:08.451	2026-06-12 09:01:08.451	1
14	Contraintes	text	2	801449df-7a84-48f6-a8ec-885aa17d64f71781254868468.html	7	2026-06-12 09:01:08.469	2026-06-12 09:01:08.469	1
15	Les trois sigles à ne pas mélanger	text	0	b17a73fc-d2cf-4135-a27d-dd7721788d181781254868506.html	8	2026-06-12 09:01:08.507	2026-06-12 09:01:08.507	1
16	Quel compromis faisons-nous?	text	0	afd315b1-10ac-4545-9819-3e0c0281b0dd1781254868529.html	9	2026-06-12 09:01:08.531	2026-06-12 09:01:08.531	1
17	Définition et principes	text	0	20da50eb-da6c-4bd7-a71a-8e3f76d2e5fe1781254868550.html	10	2026-06-12 09:01:08.551	2026-06-12 09:01:08.551	1
18	Quelle approche, pourquoi et quand?	text	0	b4ba1789-a56b-4b12-8a9d-02ac331d9c881781254868571.html	11	2026-06-12 09:01:08.572	2026-06-12 09:01:08.572	1
19	Cohésion (coherence interne d’un module)	text	0	f4596074-3940-44a4-8f11-16b1eef54f9a1781254868595.html	12	2026-06-12 09:01:08.596	2026-06-12 09:01:08.596	1
20	Couplage (dépendances entre modules)	text	1	e0c2fcea-d93e-4c0a-80b6-7539771aa6ff1781254868612.html	12	2026-06-12 09:01:08.613	2026-06-12 09:01:08.613	1
21	Séparation des préoccupations (SoC)	text	2	81a519d5-d734-46b5-b568-ee741108fe461781254868630.html	12	2026-06-12 09:01:08.631	2026-06-12 09:01:08.631	1
22	Dette technique (et intérêt de la dette)	text	3	cd08be80-3ac2-43fa-9b8d-39fd47cb8d371781254868650.html	12	2026-06-12 09:01:08.651	2026-06-12 09:01:08.651	1
23	DRY	text	4	8121f926-e872-4ae1-8e46-c263f9ac3fca1781254868770.html	12	2026-06-12 09:01:08.772	2026-06-12 09:01:08.772	1
24	KISS	text	5	0d496d44-1c3c-4341-be92-165e1925254d1781254868799.html	12	2026-06-12 09:01:08.801	2026-06-12 09:01:08.801	1
25	YAGNI	text	6	bb7c3b59-ad5a-4405-8903-53cb4d2363ff1781254868829.html	12	2026-06-12 09:01:08.831	2026-06-12 09:01:08.831	1
\.


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, "idMdb") FROM stdin;
1	6a2bb0b46018b57680b67ebd
2	6a2bb0b46018b57680b67edd
3	6a2bb0b46018b57680b67ede
4	6a2bb0b46018b57680b67edf
5	6a2bb0b46018b57680b67ee0
6	6a2bb0b46018b57680b67ee1
7	6a2bb0b46018b57680b67ec1
8	6a2bb0b46018b57680b67ec3
9	6a2bb0b46018b57680b67eea
10	6a2bb0b46018b57680b67eeb
11	6a2bb0b46018b57680b67eec
12	6a2bb0b46018b57680b67eed
13	6a2bb0b46018b57680b67eee
\.


--
-- Data for Name: Authorization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Authorization" (id, role, action, resource) FROM stdin;
\.


--
-- Data for Name: BonusActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BonusActivity" (id, title, type, "order", url, "createdAt", "updatedAt", "adminId", "resourceId") FROM stdin;
\.


--
-- Data for Name: BonusSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BonusSkill" (id, description, "createdAt", "updatedAt", badge, "parcoursId") FROM stdin;
1	Architecture et ingénierie : Modélisation de systèmes, patrons de conception (design patterns), architecture logicielle.\n	2026-06-12 08:51:23.565	2026-06-12 08:51:23.565	\N	1
\.


--
-- Data for Name: BonusSkillsOnModuleMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BonusSkillsOnModuleMetadata" ("bonusSkillId", "moduleId") FROM stdin;
1	1
1	2
1	3
1	4
\.


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contact" (id, "idMdb", name, role, email, phone, "createdAt", "updatedAt") FROM stdin;
1	6a2bb0b46018b57680b67ec1	raymond dupont	formateur	formateur@studio.eco	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
2	6a2bb0b46018b57680b67ec3	raymond dupond	formateur	formateur2@studio.eco	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
3	6a2bb0b46018b57680b67eea	charlotte martin	formateur	charlotte.martin10@gmx.com	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
4	6a2bb0b46018b57680b67eeb	ethan bernard	formateur	ethan.bernard11@protonmail.com	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
5	6a2bb0b46018b57680b67eec	liam dubois	formateur	liam.dubois12@hotmail.com	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
6	6a2bb0b46018b57680b67eed	sophia thomas	formateur	sophia.thomas13@zoho.com	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
7	6a2bb0b46018b57680b67eee	sophia robert	formateur	sophia.robert14@gmail.com	06 06 06 06 06	2026-06-12 07:09:42.478	2026-06-12 07:09:42.478
\.


--
-- Data for Name: ContactsOnCourse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactsOnCourse" ("contactId", "courseId") FROM stdin;
\.


--
-- Data for Name: ContactsOnModuleMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactsOnModuleMetadata" ("contactId", "moduleId") FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
1	2
2	2
3	2
4	2
5	2
6	2
7	2
1	3
2	3
3	3
4	3
5	3
6	3
7	3
1	4
2	4
3	4
4	4
5	4
6	4
7	4
\.


--
-- Data for Name: ContactsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactsOnParcours" ("parcoursId", "contactId") FROM stdin;
1	7
1	6
1	5
1	4
1	3
1	2
1	1
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, description, image, "moduleId", "virtualClass", visibility, scenario, dates, "order", "isPublished", "createdAt", "updatedAt", author, "adminId", "courseSlug") FROM stdin;
1	Concevoir une application		\N	1	\N	t	t	\N	0	t	2026-06-12 09:01:07.884	2026-06-12 09:01:23.599	Import	1	conception-eisi
2	Architecture Logicielle		\N	1	\N	t	t	\N	1	t	2026-06-12 09:01:08.185	2026-06-12 09:01:29.455	Import	1	architecture-logicielle
\.


--
-- Data for Name: Formation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Formation" (id, title, description, code, level, "createdAt", "updatedAt", "adminId") FROM stdin;
1	Développeur Web	Toutes les compétences pour développer des applications web et web mobile	1234	3	2026-06-12 07:09:42.463	2026-06-12 07:09:42.463	1
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, "idMdb") FROM stdin;
1	6a2bc9d07b8ed31351c4f144
\.


--
-- Data for Name: GroupsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupsOnParcours" ("groupId", "parcoursId") FROM stdin;
1	1
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lesson" (id, title, description, modalite, "createdAt", "updatedAt", author, "adminId", "courseId", "tagId", "order", "isPublished", visibility) FROM stdin;
1	Présentation		hybride	2026-06-12 09:01:07.889	2026-06-12 09:01:07.889	Import	1	1	1	0	f	f
2	Référentiel		hybride	2026-06-12 09:01:07.892	2026-06-12 09:01:07.892	Import	1	1	1	1	f	f
3	OUTILS		hybride	2026-06-12 09:01:07.895	2026-06-12 09:01:07.895	Import	1	1	1	2	f	f
4	RESSOURCES		hybride	2026-06-12 09:01:07.898	2026-06-12 09:01:07.898	Import	1	1	1	3	f	f
5	Introduction		hybride	2026-06-12 09:01:08.188	2026-06-12 09:01:08.188	Import	1	2	1	0	f	f
6	L'importance de l’architecture logicielle		hybride	2026-06-12 09:01:08.19	2026-06-12 09:01:08.19	Import	1	2	1	1	f	f
7	Les drivers d'architecture		hybride	2026-06-12 09:01:08.192	2026-06-12 09:01:08.192	Import	1	2	1	2	f	f
8	Les objectifs mésurables - SLO SLI SLA		hybride	2026-06-12 09:01:08.194	2026-06-12 09:01:08.194	Import	1	2	1	3	f	f
9	Software Architecture Trade-offs		hybride	2026-06-12 09:01:08.195	2026-06-12 09:01:08.195	Import	1	2	1	4	f	f
10	Clean Architecture - Architecture Propre		hybride	2026-06-12 09:01:08.197	2026-06-12 09:01:08.197	Import	1	2	1	5	f	f
11	Approche de conception - Top-down vs. Bottom-up		hybride	2026-06-12 09:01:08.198	2026-06-12 09:01:08.198	Import	1	2	1	6	f	f
12	Principes Fondamentaux		hybride	2026-06-12 09:01:08.199	2026-06-12 09:01:08.199	Import	1	2	1	7	f	f
\.


--
-- Data for Name: LessonRating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonRating" (id, rating, "lessonId", "studentId") FROM stdin;
1	5	1	1
2	1	2	1
\.


--
-- Data for Name: LessonRead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonRead" (id, "beganAt", "lastOpenedAt", "finishedAt", "lessonId", "studentId") FROM stdin;
3	2026-06-12 09:36:55.316	2026-06-12 09:36:55.316	2026-06-12 09:37:12.263	2	1
1	2026-06-12 09:27:20.65	2026-06-12 09:40:09.545	2026-06-12 09:36:51.967	1	1
4	2026-06-12 09:37:19.606	2026-06-12 09:46:32.933	\N	3	1
2	2026-06-12 09:30:56.453	2026-06-12 09:50:30.261	\N	4	1
5	2026-06-12 09:58:30.235	2026-06-12 09:58:30.235	\N	1	3
\.


--
-- Data for Name: Mediatheque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mediatheque" (id, type, url, name, "authorId", size, used, "createdAt", "updatedAt") FROM stdin;
1	image	image-87a744c2-00e0-4912-8605-6f264cc57fbd.png	image.png	1	52153	1	2026-06-12 09:01:08.274	2026-06-12 09:01:08.274
2	image	image-4db6e891-30a0-434f-ba96-c5c7379561ea.png	image.png	1	52153	1	2026-06-12 09:01:08.697	2026-06-12 09:01:08.697
3	image	image-485f43db-190e-4b24-954c-2677982b7f8b.png	image__1_.png	1	50824	1	2026-06-12 09:01:08.745	2026-06-12 09:01:08.745
\.


--
-- Data for Name: Module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Module" (id, title, description, image, thumb, "createdAt", "updatedAt", author, "adminId", "quizInstructions") FROM stdin;
1	Fondations de l'Ingénierie et de l'Architecture	Ce module pose les bases nécessaires pour penser et structurer une application avant même d'écrire la première ligne de code.	\N	\N	2026-06-12 08:52:41.136	2026-06-12 08:52:41.136	jean fontaine	1	Questionnaire formatif en français, ton expert et didactique. Priorité aux principes de conception logicielle et aux modèles d’architecture. Inclure uniquement des questions à choix multiples auto corrigeables.
2	Développement, Performance et Inclusion	Ce module se concentre sur la création technique du produit en alliant performance backend et responsabilité sociétale (inclusivité).	\N	\N	2026-06-12 08:53:52.384	2026-06-12 08:53:52.384	jean fontaine	1	Questionnaire d’évaluation en français, ton encourageant et clair. Priorité aux concepts de développement backend et aux standards d’accessibilité. Inclure uniquement des questions vrai ou faux et des choix multiples auto corrigeables.
3	 Infrastructure, Déploiement et Sécurité	Ce module aborde l'hébergement, la distribution des applications et la protection vitale des données.	\N	\N	2026-06-12 08:54:29.56	2026-06-12 08:54:29.56	jean fontaine	1	Test de validation en français, ton professionnel et direct. Priorité aux environnements cloud et à la sécurité des systèmes d information. Inclure uniquement des questions à correction automatique.
4	Management, Stratégie et Innovation	Ce dernier module donne de la hauteur au profil technique en lui apportant les clés du leadership et de l'anticipation.	\N	\N	2026-06-12 08:55:01.492	2026-06-12 08:55:01.492	jean fontaine	1	Questionnaire récapitulatif en français, ton pragmatique et clair. Priorité aux méthodologies de projet et à l alignement stratégique. Inclure uniquement des questions auto corrigeables ciblant la prise de décision.
\.


--
-- Data for Name: ModuleMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ModuleMetadata" (id, duration, rating, "minDate", "maxDate", "moduleId", "createdAt", "updatedAt", "adminId", "parcoursId") FROM stdin;
4	12	\N	2026-06-13 00:00:00	2026-06-16 00:00:00	4	2026-06-12 08:55:01.496	2026-06-12 08:55:10.776	1	1
3	12	\N	2026-06-16 00:00:00	2026-06-28 00:00:00	3	2026-06-12 08:54:29.565	2026-06-12 08:55:17.565	1	1
2	12	\N	2026-06-13 00:00:00	2026-06-20 00:00:00	2	2026-06-12 08:53:52.393	2026-06-12 08:55:21.756	1	1
1	12	\N	2026-06-15 00:00:00	2026-07-09 00:00:00	1	2026-06-12 08:52:41.145	2026-06-12 08:55:28.724	1	1
\.


--
-- Data for Name: ModulesOnFormation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ModulesOnFormation" ("moduleId", "formationId") FROM stdin;
1	1
2	1
3	1
4	1
\.


--
-- Data for Name: Objective; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Objective" (id, description, "createdAt", "updatedAt", "parcoursId") FROM stdin;
1	Concevoir et structurer des applications complexes et évolutives.\n	2026-06-12 08:51:09.588	2026-06-12 08:51:09.588	1
\.


--
-- Data for Name: OpenBadge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenBadge" (id, creator, image, url, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Parcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Parcours" (id, title, description, "startDate", "endDate", degree, image, thumb, "createdAt", "updatedAt", author, visibility, "adminId", "formationId", "virtualClass", "isPublished") FROM stdin;
1	Expertise en Architecture Ingénierie Logicielle et Stratégie IT	Ce parcours intensif est conçu pour les développeurs et professionnels de l'informatique souhaitant évoluer vers des postes à hautes responsabilités techniques et stratégiques (Tech Lead, Architecte Logiciel, Chef de Projet Technique). Il offre une vision à 360 degrés couvrant la conception de systèmes robustes, le développement backend performant, la sécurisation des infrastructures cloud, ainsi que le pilotage de projets et la stratégie d'entreprise.	2026-06-13 00:00:00	2026-08-12 00:00:00	\N	\N	\N	2026-06-12 08:50:33.283	2026-06-12 08:56:55.286	jean fontaine	f	1	1	\N	t
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quiz" (id, title, type, "moduleId", "activityId", "courseId", "createdAt", "updatedAt", "studentId") FROM stdin;
1	Quiz préliminaire - Fondations de l'Ingénierie et de l'Architecture	preliminary	1	\N	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	\N
2	Quiz de fin - Concevoir une application	ending_course	\N	\N	1	2026-06-12 09:32:02.262	2026-06-12 09:32:02.262	1
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizQuestion" (id, "externalId", type, difficulty, prompt, "explanationTrue", "explanationWrong", tags, data, "contentHash", "createdAt", "updatedAt", "quizId") FROM stdin;
1	q_000	true_false	easy	Un diagramme de classes en ingénierie logicielle représente uniquement les attributs et méthodes des objets sans montrer leurs relations entre eux.	Parce qu'un diagramme de classes décrit aussi les **associations** (ex : 'un Client * commande une Commande 1'), **héritages** (ex : 'Voiture hérite de Véhicule') et **dépendances**, qui définissent la structure globale du système.	Cette affirmation est fausse car un diagramme de classes **intègre systématiquement** les relations entre classes (comme les flèches de généralisation ou d'agrégation). Par exemple, omettre ces liens rendrait impossible de comprendre que 'un Compte * possède des Transactions 0..n'. Ces relations sont aussi cruciales que les attributs pour modéliser une architecture. Pour corriger : un diagramme de classes valide doit inclure **au minimum** les classes, leurs propriétés, et leurs interactions (même basiques).	{modélisation,"conception logicielle",UML}	{"bloom": "remember", "pairs": null, "choices": null, "evidence": null, "answer_key": false, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
2	q_001	matching	easy	Associez chaque terme à sa définition ou son rôle dans le contexte de l'ingénierie logicielle et de l'architecture des applications. Une seule association est correcte par ligne.	Ces termes décrivent des éléments clés de la conception logicielle : leur rôle est de structurer, organiser ou décrire les composants d'une application avant son développement. Par exemple, un *modèle* représente la logique métier, tandis qu'une *API* est un contrat d'échange de données.	• **Modèle** ↔ *Interface utilisateur* : Faux. Un modèle représente les données et la logique métier (ex : règles de calcul), tandis que l'interface utilisateur (UI) gère l'affichage et les interactions avec l'utilisateur. Confusion courante entre *ce qui est affiché* et *ce qui est calculé/structuré* en arrière-plan.\n\n• **API** ↔ *Base de données* : Faux. Une API (Application Programming Interface) est un ensemble de règles pour échanger des données entre systèmes, tandis qu'une base de données stocke et gère les données elles-mêmes. Une API peut *accéder* à une base de données, mais n'en est pas une.\n\n• **Architecture** ↔ *Langage de programmation* : Faux. L'architecture décrit la structure globale d'une application (ex : couches, composants), tandis qu'un langage de programmation (comme Python ou Java) est un outil pour *implémenter* cette structure. Confusion entre *conception* et *implémentation*.\n\n• **Composant** ↔ *Algorithme* : Faux. Un composant est une unité modulaire réutilisable d'une application (ex : un service d'authentification), tandis qu'un algorithme est une procédure pour résoudre un problème spécifique (ex : tri rapide). Un composant peut *utiliser* des algorithmes, mais n'en est pas un.\n\n• **UI (Interface Utilisateur)** ↔ *Logique métier* : Faux. L'UI gère l'affichage et les interactions (ex : boutons, formulaires), tandis que la logique métier contient les règles du domaine (ex : validation d'une commande). Confusion entre *présentation* et *traitement des données*.\n\n• **Microservice** ↔ *Fonctionnalité unique* : Faux. Un microservice est une architecture où une application est divisée en *services indépendants* (ex : service de paiement, service de recommandation), chacun pouvant être développé, déployé et mis à jour séparément. Une 'fonctionnalité unique' est trop vague pour définir un microservice, qui implique aussi *autonomie* et *communication via API*.\n\n**Règle générale** : Ces termes décrivent des *niveaux de granularité* dans la conception logicielle. Un **modèle** ou une **logique métier** traite des données et règles, une **API** ou un **composant** facilite la communication ou la modularité, et une **architecture** ou un **microservice** organise l'ensemble. L'**UI** est le seul terme centré sur l'expérience utilisateur.	{concepts_fondamentaux,architecture_software,prerequis}	{"bloom": "remember", "pairs": [{"left": "Modèle", "right": "Logique métier et données structurées"}, {"left": "API", "right": "Contrat pour échanger des données entre systèmes"}, {"left": "Architecture", "right": "Structure globale d'une application (ex : couches, microservices)"}, {"left": "Composant", "right": "Unité modulaire réutilisable (ex : module d'authentification)"}, {"left": "UI (Interface Utilisateur)", "right": "Affichage et interactions avec l'utilisateur"}, {"left": "Microservice", "right": "Service autonome dans une architecture décentralisée"}], "choices": null, "evidence": null, "answer_key": null, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
3	q_002	mcq	easy	Quel est le rôle principal d'un **modèle** dans une architecture logicielle orientée objet ?	Parce qu'un modèle encapsule les données et les comportements associés à un concept métier, en isolant la logique interne pour faciliter la réutilisation et la maintenance.	A est faux car un **contrôleur** gère les flux entre modèles et interfaces, mais ne stocke pas les données. B est faux car une **base de données** persiste les données, mais ne définit pas leur structure logique ou leurs méthodes. D est faux car une **interface utilisateur** affiche les informations, mais ne contient pas la logique métier ou les règles d'affaires.	{architecture-logicielle,conception-orientée-objet,principe-de-base}	{"bloom": "remember", "pairs": null, "choices": ["Encapsuler les données et les comportements liés à un concept métier.", "Stocker les données de manière persistante dans un système de fichiers.", "Gérer les requêtes HTTP entre le client et le serveur.", "Afficher les informations à l'utilisateur final via une interface graphique."], "evidence": null, "answer_key": 0, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
4	q_003	true_false	easy	En architecture logicielle, un **composant** est une unité indépendante qui ne peut pas être réutilisée dans d'autres contextes ou systèmes.	Parce qu'un composant est conçu pour être **modulaire et interchangeable**, ce qui permet sa réutilisation dans différents contextes ou systèmes. Son indépendance est précisément sa force fonctionnelle.	Un composant est **par définition** conçu pour être réutilisable et interchangeable. Par exemple, une bibliothèque de calculs mathématiques peut être intégrée dans un logiciel de comptabilité ou un outil de visualisation. L'affirmation inverse cette propriété clé : un composant qui ne serait pas réutilisable violerait les principes de modularité et de découplage en architecture logicielle.	{"architecture logicielle",composants,réutilisabilité}	{"bloom": "remember", "pairs": null, "choices": null, "evidence": null, "answer_key": false, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
5	q_004	ordering	medium	Classez les étapes suivantes dans l'ordre logique d'une **analyse préliminaire** pour concevoir une application logicielle, depuis la phase la plus initiale jusqu'à la préparation des spécifications techniques. Chaque étape doit précéder celle qui dépend d'elle.	Parce que chaque étape doit être validée ou produite avant que la suivante ne puisse s'exécuter : sans *besoins* identifiés, on ne peut pas *analyser* ; sans analyse, impossible de *modéliser* ; sans modèle, les *spécifications* techniques ne peuvent être détaillées ; enfin, les *prototypes* nécessitent des spécifications claires pour être conçus.	(1) **Identifier les besoins utilisateurs** — Étape fondatrice : sans compréhension des attentes, aucune analyse ou conception ne peut démarrer. Les besoins définissent le périmètre du projet et orientent toutes les décisions ultérieures. Une erreur courante est de sauter cette étape pour aller directement à la technique, ce qui mène à des solutions inadaptées ou surdimensionnées.\n\n(2) **Analyser les contraintes techniques et organisationnelles** — Cette étape évalue la faisabilité (budget, technologies disponibles, ressources humaines) *après* avoir cerné les besoins. Sans cette analyse, les contraintes pourraient invalider des choix techniques prématurés. Par exemple, une contrainte de temps pourrait exclure une technologie nécessitant un long cycle de développement.\n\n(3) **Modéliser les composants et interactions** — Ici, on traduit les besoins et contraintes en *diagrammes* (classes, flux, etc.) pour visualiser l'architecture. Cette étape suppose que les besoins sont stabilisés et les contraintes connues. Un modèle bâti trop tôt pourrait ignorer des contraintes critiques.\n\n(4) **Rédiger les spécifications techniques détaillées** — Basées sur le modèle, ces spécifications décrivent *comment* chaque composant fonctionnera (API, bases de données, etc.). Elles ne peuvent être écrites sans modèle validé, car elles dépendent des décisions d'architecture.\n\n(5) **Concevoir des prototypes ou maquettes** — Les prototypes illustrent des fonctionnalités clés *après* avoir défini ce qui doit être implémenté. Les concevoir trop tôt risquerait de valider des hypothèses non alignées avec les spécifications.\n\nRègle : Une analyse préliminaire suit une **logique de dépendance causale** : chaque étape *produit* un artefact nécessaire à la suivante. Sauter une étape équivaut à travailler sur des hypothèses non validées.	{"conception logicielle","ingénierie système","cycle de vie logiciel"}	{"bloom": "understand", "pairs": null, "choices": null, "evidence": null, "answer_key": null, "ordering_items": ["Concevoir des prototypes ou maquettes pour valider des fonctionnalités clés", "Rédiger les spécifications techniques détaillées (API, bases de données, etc.)", "Modéliser les composants et leurs interactions (diagrammes UML, flux, etc.)", "Analyser les contraintes techniques et organisationnelles (budget, technologies, ressources)", "Identifier les besoins utilisateurs et fonctionnels (périmètre, attentes)"], "choice_feedback": null, "ordering_answer": [4, 3, 2, 1, 0]}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
6	q_005	mcq	easy	Dans le contexte de l'ingénierie logicielle, qu'est-ce qu'un **prototype** ?	Parce qu'un prototype est une version simplifiée et fonctionnelle d'un produit ou d'une application, utilisée pour valider des concepts ou des idées avant un développement complet.	A est faux car un prototype n'est pas une spécification technique détaillée, mais une implémentation partielle ou une maquette. B est faux car un prototype n'est pas une documentation, mais un artefact concret. D est faux car un prototype n'est pas une solution définitive, mais une étape intermédiaire pour tester des hypothèses.	{conception,pratique,"ingénierie logicielle"}	{"bloom": "remember", "pairs": null, "choices": ["Une spécification technique détaillée décrivant toutes les fonctionnalités d'une application.", "Un document décrivant les exigences fonctionnelles et non fonctionnelles d'un projet.", "Une version fonctionnelle et simplifiée d'un produit, utilisée pour valider des idées avant le développement complet.", "La solution finale et opérationnelle d'un projet, prête à être déployée en production."], "evidence": null, "answer_key": 2, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
7	q_006	mcq	easy	Dans le contexte de l'ingénierie logicielle, quel terme désigne **l'ensemble des règles et conventions qui définissent comment les composants d'un système interagissent entre eux** ?	Parce que l'**architecture logicielle** décrit les structures, les interactions et les principes de conception qui organisent un système pour répondre à ses objectifs fonctionnels et non fonctionnels.	A est faux car une **API** (Application Programming Interface) est un ensemble de protocoles et de routines pour accéder à des services, mais ne couvre pas la vision globale des interactions entre composants. B est faux car un **modèle** représente une abstraction d'un domaine ou d'une partie du système, mais ne décrit pas les règles d'interaction entre composants. D est faux car un **pattern** (modèle de conception) est une solution réutilisable à un problème récurrent, mais ne définit pas à lui seul l'ensemble des règles d'architecture d'un système.	{architecture,conception,principe}	{"bloom": "remember", "pairs": null, "choices": ["Une API (Interface de Programmation d'Application)", "Un modèle (Model)", "L'architecture logicielle (Software Architecture)", "Un pattern (Modèle de conception)"], "evidence": null, "answer_key": 2, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
8	q_007	mcq	easy	Dans le contexte de l'ingénierie logicielle, quel terme désigne une **description abstraite et structurée** d'un système, qui sert de référence pour son développement et son évolution ?	Parce qu'un **modèle** est une représentation simplifiée et formalisée d'un système, permettant de comprendre ses composants, leurs interactions et leurs règles sans implémentation concrète.	A est faux car un **schéma** est généralement une illustration visuelle (ex : diagramme UML), mais ne décrit pas la logique ou les règles du système de manière abstraite. B est faux car un **algorithme** décrit une séquence d'opérations précises pour résoudre un problème, pas une description globale du système. D est faux car un **framework** est un ensemble d'outils ou de bibliothèques prêtes à l'emploi pour construire une application, pas une représentation théorique.	{concepts_fondamentaux,architecture_logicielle,modélisation}	{"bloom": "remember", "pairs": null, "choices": ["Un schéma", "Un algorithme", "Un modèle", "Un framework"], "evidence": null, "answer_key": 2, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
9	q_008	mcq	easy	Dans le contexte de l'ingénierie logicielle, quel terme désigne **l'ensemble des règles et conventions** qui guident la conception et l'organisation d'une application pour en assurer la cohérence et la maintenabilité ?	Parce que l’**architecture logicielle** définit les règles et conventions structurelles pour organiser les composants, les interactions et les niveaux d’abstraction d’une application, garantissant ainsi sa cohérence et sa maintenabilité.	A est faux car une **spécification technique** détaille les choix technologiques (langages, frameworks) mais ne couvre pas les règles de conception globales. B est faux car un **diagramme de classes** est un outil visuel représentant les objets et leurs relations, pas un ensemble de règles. D est faux car un **prototype** est une implémentation partielle pour valider des concepts, sans définir des règles structurelles.	{architecture,conception,principe,prérequis}	{"bloom": "remember", "pairs": null, "choices": ["Une spécification technique", "Un diagramme de classes", "Une architecture logicielle", "Un prototype"], "evidence": null, "answer_key": 2, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
10	q_009	mcq	easy	Dans le contexte de l'ingénierie logicielle, quel terme désigne **une représentation simplifiée et visuelle d'un système**, utilisée pour clarifier sa structure, ses interactions ou son fonctionnement avant sa mise en œuvre technique ?	Parce que le **diagramme** est un outil graphique standardisé pour visualiser les éléments d'un système (classes, flux, composants) et leurs relations, facilitant la communication entre les parties prenantes.	A est faux car un **schéma** est souvent plus technique et détaillé, axé sur des aspects physiques ou électroniques plutôt que sur la logique ou l'architecture logicielle. B est faux car un **algorithme** désigne une séquence d'étapes pour résoudre un problème, pas une représentation visuelle. D est faux car un **prototype** est une implémentation fonctionnelle partielle ou complète, pas une simple représentation abstraite.	{modélisation,conception,prérequis}	{"bloom": "remember", "pairs": null, "choices": ["Un schéma", "Un algorithme", "Un diagramme", "Un prototype"], "evidence": null, "answer_key": 2, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:06:13.955	2026-06-12 09:06:13.955	1
11	102cd2a9-e841-46ed-b023-2004509ca070	mcq	medium	Selon le principe **Single Responsibility Principle (SRP)** de SOLID, quelle affirmation est correcte ?	Le SRP repose sur l'idée qu'une classe doit avoir une seule raison de changer, ce qui revient à lui assigner une seule responsabilité. Cela simplifie la maintenance et réduit les risques d'erreurs.	Analyse des options : A est incorrecte car le SRP interdit les responsabilités multiples, même liées. C est fausse car le SRP interdit les classes qui changent pour plusieurs raisons (donc plusieurs responsabilités). D est erronée car le SRP est universel, pas réservé aux classes de haut niveau. Seule B capture l'essence du SRP : une classe doit se concentrer sur une seule tâche, même complexe.	{SOLID,SRP,conception,maintenabilité,POO}	{"bloom": "understand", "pairs": null, "choices": ["Une classe peut avoir plusieurs responsabilités si elles sont liées entre elles.", "Une classe doit être conçue pour ne faire qu'une seule chose, même si cette chose est complexe.", "Une classe peut changer pour plusieurs raisons différentes sans enfreindre le SRP.", "Le SRP ne s'applique qu'aux classes de haut niveau dans une architecture."], "evidence": ["Chaque classe doit avoir une seule responsabilité ou raison de changer.", "Cela signifie qu'une classe ne doit faire qu'une seule chose, ce qui facilite sa compréhension et sa maintenance."], "answer_key": 1, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["Selon le principe **Single Responsibility Principle (SRP)** de SOLID, quelle affirmation est correcte ?"]}, "ordering_items": null, "choice_feedback": ["Faux. Le SRP interdit précisément de regrouper plusieurs responsabilités dans une même classe, même si elles semblent liées.", "Correct. Le SRP exige qu'une classe ait une seule responsabilité bien définie, même si cette responsabilité est complexe.", "Faux. Le SRP interdit qu'une classe ait plusieurs raisons de changer, ce qui équivaut à plusieurs responsabilités.", "Faux. Le SRP s'applique à toutes les classes, pas seulement celles de haut niveau."], "ordering_answer": null}	68fb9c010b7b4f94bf7055dcf72bfde5	2026-06-12 09:29:34.113	2026-06-12 09:29:34.113	\N
12	55117a7e-7c16-42cd-bc47-3082f97ed3d2	mcq	easy	Quel est le format du dossier de conception dans une application ?	Le dossier de conception utilise le format **text** pour centraliser les spécifications techniques et fonctionnelles de l'application.	\N	{format,dossier,conception}	{"bloom": "remember", "pairs": null, "tokens": {"total_tokens": 3827, "prompt_tokens": 2229, "completion_tokens": 1598}, "choices": ["PDF", "text", "Excel", "PowerPoint"], "evidence": ["### Activités abordées :\\n- **Dossier de conception** (Format : text)"], "answer_key": 1, "course_name": "Concevoir une application", "ordering_items": null, "choice_feedback": ["PDF est un format de document, mais pas celui spécifié pour le dossier de conception.", null, "Excel est un format de tableur, non utilisé ici pour ce dossier.", "PowerPoint est un format de présentation, incompatible avec les besoins techniques du dossier."], "ordering_answer": null}	\N	2026-06-12 09:32:02.262	2026-06-12 09:32:02.262	2
13	a46aaf39-86ff-4dfd-ab79-ece7727691a8	true_false	easy	Le dossier de l'application développé est au format Excel.	Le dossier de l'application développé est en **format text**, comme indiqué dans le contenu. Excel n'est pas mentionné comme un format valide.	L'affirmation est fausse car le contenu précise explicitement que le dossier de l'application développé est au **format text**. Excel est un format de tableur, inapproprié pour ce type de dossier.	{format,dossier,développement}	{"bloom": "remember", "pairs": null, "tokens": {"total_tokens": 3827, "prompt_tokens": 2229, "completion_tokens": 1598}, "evidence": ["### Activités abordées :\\n- **Dossier de l'application développé** (Format : text)"], "answer_key": false, "course_name": "Concevoir une application", "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	\N	2026-06-12 09:32:02.262	2026-06-12 09:32:02.262	2
14	a0eb17f1-ece3-43c5-9564-bfb359324e22	mcq	easy	Parmi les objectifs suivants, lequel N'EST PAS mentionné dans le plan de maintenance de l'application web ?	Le plan de maintenance se concentre sur la disponibilité, la sécurité, la performance et les mises à jour, mais ne mentionne aucun objectif lié aux coûts de développement. Les quatre autres options sont des priorités claires énoncées dans la section 'Objectifs'.	Les trois premières options sont des objectifs principaux du plan, directement extraits de la liste sous la section 'Objectifs'. La confusion pourrait venir d'une généralisation sur les plans de maintenance, mais ici, le texte est précis : il ne parle pas de coûts. Les autres options sont des priorités techniques et utilisateur clairement définies.	{}	{"bloom": "remember", "pairs": null, "choices": ["Garantir la disponibilité continue de l'application", "Optimiser les coûts de développement à long terme", "Assurer la sécurité des données et des utilisateurs", "Améliorer la performance et l'expérience utilisateur"], "evidence": ["Garantir la disponibilité continue de l'application.", "Assurer la sécurité des données et des utilisateurs.", "Améliorer la performance et l'expérience utilisateur."], "answer_key": 1, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["Parmi les objectifs suivants, lequel N'EST PAS mentionné dans le plan de maintenance de l'application web ?"]}, "ordering_items": null, "choice_feedback": ["Cette option est explicitement citée dans la section 'Objectifs' du plan.", "Correct. Le texte ne mentionne pas l'optimisation des coûts comme objectif.", "Cette option est explicitement citée dans la section 'Objectifs' du plan.", "Cette option est explicitement citée dans la section 'Objectifs' du plan."], "ordering_answer": null}	2a512d7a21e54b9da0f14dd8fb9abd6e	2026-06-12 09:33:13.445	2026-06-12 09:33:13.445	\N
15	b256ab5a-b025-416b-95de-3a47cb438b00	mcq	medium	Un développeur découvre qu'une nouvelle mise à jour du framework utilisé par l'application a introduit un bug critique dans une fonctionnalité existante. Quelle action de maintenance doit-il prioriser pour résoudre ce problème ?	Les tests de régression sont conçus pour détecter précisément les régressions causées par des mises à jour, comme ici. Sans eux, le bug pourrait passer inaperçu et s’étendre, aggravant les problèmes.	L’erreur ici vient souvent d’une confusion entre *prévention* (sauvegardes, planification) et *correction* (tests de régression). La sauvegarde (A) protège contre les pertes de données, mais ne corrige pas le bug. Ajouter une fonctionnalité (B) est hors sujet : le problème est une régression, pas une demande utilisateur. La révision trimestrielle (D) est trop tardive pour un bug critique urgent. Seul le test de régression (C) cible directement l’impact de la mise à jour suspecte.	{"maintenance corrective","tests de régression",bugs,"mises à jour",processus}	{"bloom": "apply", "pairs": null, "choices": ["Effectuer une sauvegarde des données avant toute intervention", "Ajouter une nouvelle fonctionnalité demandée par les utilisateurs", "Exécuter des tests de régression pour identifier les impacts de la mise à jour", "Planifier une révision trimestrielle des fonctionnalités"], "evidence": ["Tests de régression : Vérification que les nouvelles mises à jour n'ont pas introduit de nouveaux bugs.", "Correction des bugs : Identification et résolution des problèmes signalés par les utilisateurs ou détectés par des tests."], "answer_key": 2, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["Un développeur découvre qu'une nouvelle mise à jour du framework utilisé par l'application a introduit un bug critique dans une fonctionnalité existante. Quelle action de maintenance doit-il prioriser pour résoudre ce problème ?"]}, "ordering_items": null, "choice_feedback": ["Bien que les sauvegardes soient essentielles, elles ne résolvent pas directement le bug en question. C’est une précaution, mais pas une solution.", "Ajouter une nouvelle fonctionnalité n’est pas pertinent ici, car le problème concerne une régression sur une fonctionnalité existante, pas une amélioration.", "Correct. Les tests de régression permettent de vérifier l’impact de la mise à jour et d’identifier précisément où le bug s’est introduit.", "La révision trimestrielle est une étape de planification, mais elle ne traite pas un bug critique immédiat."], "ordering_answer": null}	62a418756f0f49d48204269f9ec9e2fd	2026-06-12 09:33:37.102	2026-06-12 09:33:37.102	\N
16	e72029b0-97be-474d-8c30-fafa3b55d09f	true_false	easy	La maintenance évolutive d'une application web consiste uniquement à corriger les bugs existants.	La maintenance évolutive inclut bien plus que la correction de bugs : elle vise à ajouter des fonctionnalités et à adapter l'application aux évolutions technologiques, comme les nouveaux navigateurs ou appareils. C'est une amélioration proactive, pas seulement une réparation.	Le texte précise clairement que la maintenance évolutive concerne deux actions distinctes : **ajouter des fonctionnalités** (basé sur les retours utilisateurs) et **s'adapter aux nouvelles technologies** (compatibilité avec les mises à jour des navigateurs ou appareils). La correction des bugs relève plutôt de la **maintenance corrective**, mentionnée séparément dans le document. Confondre les deux revient à réduire la maintenance évolutive à un rôle purement réactif, alors qu'elle est **stratégique et prospective**.	{maintenance,"application web",fonctionnalités,technologies}	{"bloom": "understand", "pairs": null, "choices": null, "evidence": ["Ajout de nouvelles fonctionnalités : Intégration des retours des utilisateurs pour améliorer l'application.", "Adaptation aux nouvelles technologies : Mise à jour pour rester compatible avec les dernières versions des navigateurs et des appareils."], "answer_key": false, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["La maintenance évolutive d'une application web consiste uniquement à corriger les bugs existants."]}, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	18905cd7af0347a3b42e01c5a22c2cd4	2026-06-12 09:34:25.885	2026-06-12 09:34:25.885	\N
17	8a154f01-be63-4cc6-8ecb-ef46dfeaa457	matching	medium	Associez chaque type de maintenance à sa description correspondante dans le plan de maintenance de l'application web.	Chaque type de maintenance répond à un besoin spécifique : la préventive agit avant les problèmes, la corrective les résout après leur apparition, et l'évolutive améliore l'application. Retiens : Préventive = Éviter, Corrective = Réparer, Évolutive = Améliorer.	Voici les bonnes associations et pourquoi elles sont justifiées par le texte source :\n• **Maintenance préventive** 'Surveillance des performances et mises à jour régulières' : Le texte précise que cette maintenance inclut des mises à jour régulières du système et une surveillance des performances pour éviter les problèmes avant qu'ils ne surviennent.\n• **Maintenance corrective** 'Résolution des bugs et tests de régression' : Le texte décrit explicitement la correction des bugs et les tests de régression pour s'assurer que les corrections n'introduisent pas de nouveaux problèmes.\n• **Maintenance évolutive** 'Ajout de fonctionnalités et adaptation aux nouvelles technologies' : Le texte mentionne l'ajout de nouvelles fonctionnalités et l'adaptation aux nouvelles technologies pour améliorer l'application et la rendre compatible avec les évolutions.\nRetiens : La maintenance préventive est proactive, la corrective est réactive, et l'évolutive est future-oriented.	{maintenance,types,"application web",processus,sécurité}	{"bloom": "understand", "pairs": [{"left": "Maintenance préventive", "right": "Surveillance des performances et mises à jour régulières pour éviter les problèmes"}, {"left": "Maintenance corrective", "right": "Résolution des bugs et tests de régression pour corriger les dysfonctionnements"}, {"left": "Maintenance évolutive", "right": "Ajout de fonctionnalités et adaptation aux nouvelles technologies pour améliorer l'application"}], "choices": null, "evidence": ["Maintenance préventive : Mises à jour régulières du système, serveurs, bibliothèques et frameworks. Surveillance des performances.", "Maintenance corrective : Correction des bugs identifiés par les utilisateurs ou détectés par des tests. Tests de régression pour vérifier l'absence de nouveaux bugs.", "Maintenance évolutive : Ajout de nouvelles fonctionnalités et adaptation aux nouvelles technologies pour rester compatible."], "answer_key": null, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["Associez chaque type de maintenance à sa description correspondante dans le plan de maintenance de l'application web."]}, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	247a7bd82596462ba65d852613daf244	2026-06-12 09:54:33.544	2026-06-12 09:54:33.544	\N
18	b5e24d1a-8116-4fd3-b13f-625e7dc77266	matching	easy	Associez chaque type de maintenance décrit dans le plan à sa définition ou activité principale.	Ces trois types de maintenance forment une approche complète pour gérer une application web. La maintenance préventive agit comme une protection proactive, la corrective résout les problèmes existants, et l'évolutive prépare l'application à l'avenir. Retiens : Préventive = éviter, Corrective = réparer, Évolutive = progresser.	Voici les bonnes associations et pourquoi elles sont correctes pour chaque type de maintenance selon le texte source :\n• **Maintenance préventive** 'Surveillance des performances et mises à jour régulières' : Cette maintenance vise à éviter les problèmes avant qu'ils n'apparaissent, en mettant à jour les composants critiques (système, serveurs, bibliothèques) et en surveillant la charge du serveur.\n• **Maintenance corrective** 'Correction des bugs et tests de régression' : Ici, l'objectif est de résoudre les problèmes déjà identifiés, que ce soit via les retours utilisateurs ou des tests, et de s'assurer que les corrections n'introduisent pas de nouveaux dysfonctionnements.\n• **Maintenance évolutive** 'Ajout de nouvelles fonctionnalités et adaptation aux technologies récentes' : Ce type de maintenance se concentre sur l'amélioration continue de l'application en intégrant des retours utilisateurs et en modernisant les technologies pour rester compatible avec les évolutions du marché.\n\nRetiens : La maintenance préventive et corrective sont souvent réactives ou préventives, tandis que la maintenance évolutive est orientée vers l'innovation et l'adaptation.	{}	{"bloom": "understand", "pairs": [{"left": "Maintenance préventive", "right": "Surveillance des performances et mises à jour régulières pour éviter les problèmes"}, {"left": "Maintenance corrective", "right": "Correction des bugs et tests pour s'assurer que les corrections ne créent pas de nouveaux problèmes"}, {"left": "Maintenance évolutive", "right": "Ajout de nouvelles fonctionnalités et adaptation aux technologies récentes"}], "choices": null, "evidence": ["Maintenance préventive : Mises à jour régulières et surveillance des performances.", "Maintenance corrective : Correction des bugs et tests de régression.", "Maintenance évolutive : Ajout de nouvelles fonctionnalités et adaptation aux nouvelles technologies."], "answer_key": null, "session_meta": {"user_id": "6a2bb0b46018b57680b67ec7", "course_id": null, "past_questions": ["Associez chaque type de maintenance décrit dans le plan à sa définition ou activité principale."]}, "ordering_items": null, "choice_feedback": null, "ordering_answer": null}	4109c1717e604dacabf48085f4d721c8	2026-06-12 09:54:52.642	2026-06-12 09:54:52.642	\N
\.


--
-- Data for Name: QuizQuestionReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizQuestionReport" (id, "quizQuestionId", commentaire) FROM stdin;
1	3	Je trouve que la question est mal formulé.
2	12	La question est quand meme bizarre, ca peut etre n'importe quel format
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resource" (id, title, description, "createdAt", "updatedAt", author, "adminId", "imageUrl") FROM stdin;
\.


--
-- Data for Name: ResourceActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResourceActivity" (id, label, "order", url, "activityId") FROM stdin;
\.


--
-- Data for Name: ResourceBonusActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResourceBonusActivity" (id, label, "order", url, "bonusActivityId") FROM stdin;
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, description, "createdAt", "updatedAt", badge) FROM stdin;
\.


--
-- Data for Name: SkillsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SkillsOnParcours" ("skillId", "parcoursId") FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "idMdb") FROM stdin;
1	6a2bb0b46018b57680b67ec7
2	6a2bb0b46018b57680b67ec9
3	6a2bb0b46018b57680b67ef7
4	6a2bb0b46018b57680b67ef8
5	6a2bb0b46018b57680b67ef9
6	6a2bb0b46018b57680b67efa
7	6a2bb0b46018b57680b67efb
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, color, "createdAt", "updatedAt") FROM stdin;
1	HTML	rgba(255, 215, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
2	CSS	rgba(0, 0, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
3	JavaScript	rgba(220, 20, 60, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
4	TypeScript	rgba(139, 0, 139, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
5	React	rgba(0, 255, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
6	Angular	rgba(139, 69, 19, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
7	Vue.js	rgba(46, 139, 87, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
8	Node.js	rgba(255, 0, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
9	Express	rgba(128, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
10	Django	rgba(0, 0, 139, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
11	Ruby on Rails	rgba(0, 100, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
12	PHP	rgba(128, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
13	Laravel	rgba(255, 255, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
14	Symfony	rgba(0, 255, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
15	ASP.NET	rgba(0, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
16	Java	rgba(0, 128, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
17	Spring	rgba(128, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
18	C#	rgba(255, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
19	Python	rgba(0, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
20	Flask	rgba(255, 165, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
21	FastAPI	rgba(46, 139, 87, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
22	GraphQL	rgba(0, 255, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
23	REST API	rgba(255, 215, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
24	MongoDB	rgba(0, 255, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
25	MySQL	rgba(0, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
26	PostgreSQL	rgba(0, 0, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
27	Firebase	rgba(0, 100, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
28	AWS	rgba(220, 20, 60, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
29	Docker	rgba(255, 165, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
30	Kubernetes	rgba(128, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
31	Boulangerie	rgba(0, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
32	Patisserie	rgba(0, 0, 139, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
33	Boulanger	rgba(255, 0, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
34	Farine	rgba(139, 0, 139, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
35	Pâte	rgba(128, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
36	Pain	rgba(255, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
37	Croissant	rgba(255, 255, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
38	Viennoiserie	rgba(139, 69, 19, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
39	Levain	rgba(128, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
40	Fermenttion	rgba(0, 128, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
41	Artisanale	rgba(255, 0, 255, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
42	Fabrication	rgba(128, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
43	Entreprise	rgba(128, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
44	Pétrissage	rgba(0, 255, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
45	Pesée	rgba(220, 20, 60, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
46	Technique	rgba(0, 128, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
47	Approvisionnement	rgba(255, 0, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
48	Cuisson	rgba(139, 69, 19, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
49	Façonnage	rgba(0, 100, 0, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
50	Distribution	rgba(0, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
51	Alimentation	rgba(46, 139, 87, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
52	Gaspillage	rgba(128, 0, 128, 0.5)	2026-06-12 07:09:42.418	2026-06-12 07:09:42.418
\.


--
-- Data for Name: TagsOnCourse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnCourse" ("tagId", "courseId") FROM stdin;
\.


--
-- Data for Name: TagsOnFormation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnFormation" ("tagId", "formationId") FROM stdin;
5	1
4	1
3	1
2	1
1	1
\.


--
-- Data for Name: TagsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnParcours" ("tagId", "parcoursId") FROM stdin;
\.


--
-- Data for Name: TagsOnResources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnResources" ("tagId", "resourceId") FROM stdin;
\.


--
-- Data for Name: Teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Teacher" (id, "idMdb") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5effb990-fb95-45bc-b981-4c03cc1135b4	680279e09bb6b7e4b7124cd427f3ea3f2857b1f42c57fba45e6d7a551c84e7b8	2026-06-12 07:09:41.361026+00	20250124140724_ajout_mail_phone_a_contact	\N	\N	2026-06-12 07:09:41.306771+00	1
e9f22f87-9c83-4626-9aee-a0878a7e1d3f	4809f0347d94c23c54b26c04f140b3cd204279f9dfc305d24d334888e97b13a2	2026-06-12 07:09:41.426284+00	20250930133001_module_metadata	\N	\N	2026-06-12 07:09:41.421215+00	1
df0a9225-5968-4345-99a7-59a2b114d67b	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2026-06-12 07:09:41.365333+00	20250203120710_empty_migration	\N	\N	2026-06-12 07:09:41.36271+00	1
6154ef4d-063a-4c93-a089-017abc13453d	2199bc4644859110d626c851d85dafc38f6ba90d569b9e222a39a14837815d54	2026-06-12 07:09:41.371729+00	20250203120913_ajout_telephone_valeur_par_defaut_a_contact	\N	\N	2026-06-12 07:09:41.366645+00	1
7e314f37-e98c-4b37-932a-f4fe1de5c118	1d68947a61a5a9b19ead4eb3361f70becf3c3ec1e37c3b7d6292c9c57445c600	2026-06-12 07:09:41.470855+00	20251127092142_description_field_removed_from_activity_and_bonus_activity	\N	\N	2026-06-12 07:09:41.467808+00	1
740d59c5-bd04-46c9-852f-ae2a74faf59b	c68a9dfc29e1dbbf85b7bb209a0ff36a2823b9c1391829b430f9773ac3ffc13a	2026-06-12 07:09:41.376597+00	20250205101717_formation_code_et_description_optionnels	\N	\N	2026-06-12 07:09:41.372948+00	1
6829214b-36be-454e-b961-1269e4028051	e0a541e724d89c26d3ddd63de95d4d83b0babfbf1ae182f5e673f740b56c6e1c	2026-06-12 07:09:41.434446+00	20250930143011_test2	\N	\N	2026-06-12 07:09:41.42732+00	1
fc1bf1cc-1ba0-4d9e-b08f-917c5c2a0404	b155ce2ddd5f9e3013709b311f5355dd05c758e2510e4655a3b1bbdd8069bb0a	2026-06-12 07:09:41.38267+00	20250207073145_creation_table_lesson_rating	\N	\N	2026-06-12 07:09:41.37788+00	1
798136df-74ae-41c1-9cc5-db952429d0bf	08f167f0199ea0367a18576acf552235bea1ca68be076555905096c6799ef5b6	2026-06-12 07:09:41.387287+00	20250304124150_ajout_propriete_show_to_other_student_dans_accomplishment	\N	\N	2026-06-12 07:09:41.383762+00	1
d9a50103-eea0-477e-96f2-63f1680c66b8	9815ff1fd0cfecb09965219e8b6b66cce662b7f8537e280a699e192c2662380e	2026-06-12 07:09:41.392296+00	20250305090736_ajout_relation_accomplishment_et_course	\N	\N	2026-06-12 07:09:41.388466+00	1
7089958f-9872-44ab-b131-f34bc3e5351c	2262fbec4875e7fac7482ca5a2b3d7d1abc2023f65fdcdc60be8e25b5d9f3689	2026-06-12 07:09:41.439578+00	20251001071542_ajustements	\N	\N	2026-06-12 07:09:41.435552+00	1
8621ee3d-2bc1-47a9-b699-6e4f0426cc05	fc0574713275f85c433d11957ae2f51a8769b70daabd44ab381a158265ceff4e	2026-06-12 07:09:41.399977+00	20250305144743_on_delete_user_set_default_test	\N	\N	2026-06-12 07:09:41.393415+00	1
6f4ccca8-50a3-4a24-88f3-29790bececc4	5f3ef6839dc480ad79db164398646634b2664ffc8475b4bfb73a1ff884c6c75e	2026-06-12 07:09:41.407207+00	20250910080737_resource_image_url	\N	\N	2026-06-12 07:09:41.401165+00	1
ba856248-d380-4926-b5b4-453a5cd115d9	fd9dd74d6af8b7848790e388d250a6cd98ad9c76926cfc4a65b8ca66749e947d	2026-06-12 07:09:41.49346+00	20260601141529_nouvelles_tables_relatives_aux_quizzes	\N	\N	2026-06-12 07:09:41.488659+00	1
edf8b20e-bd86-4a20-bac4-9551c3255a46	345584238fb5265498fe0e024e4f4e54aacc005174719ddd91c686a5c2903b4c	2026-06-12 07:09:41.411442+00	20250910121131_removed_author_from_bonus_activity	\N	\N	2026-06-12 07:09:41.408294+00	1
e6c0177c-22ff-4b4e-baf5-f1686325027b	3f8b31dc47343935e73651526c7eb9f9e852fa3af35f533a7bd0bae6b88f2855	2026-06-12 07:09:41.445228+00	20251001072347_ajustements	\N	\N	2026-06-12 07:09:41.440591+00	1
5ea4e819-bd2c-4adf-8ea5-ac78bb06e5a9	c21a7c10d1be9a67d523f2dbc80260325931529e0c478c171abb348a609daa8c	2026-06-12 07:09:41.415369+00	20250910121506_removed_author_from_bonus_activity	\N	\N	2026-06-12 07:09:41.412424+00	1
f2c04e89-4448-4057-bf79-bcc28f0aff0b	d817094c197508e377c19eec4ae208b09a77424955e1260475f2128828ee5767	2026-06-12 07:09:41.42021+00	20250911085433_table_resource_bonus_activity	\N	\N	2026-06-12 07:09:41.416373+00	1
b83bf6c0-22ec-4dd3-a172-73361e79786b	097514af94c52437ba923cbbc7acf2da5fe36254f9f92714342952137c2637c8	2026-06-12 07:09:41.475748+00	20260122085615_added_ondelete_cascade_to_bonusskill_table	\N	\N	2026-06-12 07:09:41.471845+00	1
ed2dff68-77fb-4caf-8e67-dc3d9a8a30d0	89d3a1db619015b9ba3f0bdedcb2aa5e56ea13f6403187bc2b4c351c33438a64	2026-06-12 07:09:41.450568+00	20251008093540_removed_objectives_and_skills_from_course	\N	\N	2026-06-12 07:09:41.446266+00	1
0e5affec-8664-422d-86d6-5a8aa0a4810b	bc8821539fe82aa8af1e3afed730001227f0bb0dcf4e71ecbe8d2b415db5d3e2	2026-06-12 07:09:41.455798+00	20251022085643_on_cascade_sur_many_to_many_modulesmetadatas	\N	\N	2026-06-12 07:09:41.451567+00	1
56cc5958-4470-4f67-8d91-17c9c15c727a	332789b57d64cfa883de74888670fd334bce4b9583a9491558fd398da8d48c5e	2026-06-12 07:09:41.460932+00	20251022094142_on_delete_sur_modulesonformation	\N	\N	2026-06-12 07:09:41.45677+00	1
4fefbf37-37e9-4a99-8a65-e2df4da94e9f	d89a9bf6f0d0a83f520bd23932982057fc8a44fc6ee31a0e4fb827a7ffb8bc83	2026-06-12 07:09:41.480347+00	20260127151646_added_authorization_table_for_ia_modules	\N	\N	2026-06-12 07:09:41.476826+00	1
8b11a440-af96-42c8-8d00-10235244d457	18fb6f222f9df92e21ae4772820cfc2b9637b45b9ba2c7c301817e92aa57455c	2026-06-12 07:09:41.4668+00	20251104090811_cascade_sur_course_lesson_et_activite	\N	\N	2026-06-12 07:09:41.461901+00	1
06ffc8c8-616c-4eeb-89ff-724c9a78dc51	2772bff591f023b176528cae4c22737717038aa959537d765e0a107fbc533e65	2026-06-12 07:09:41.484264+00	20260519132228_added_quiz_instructions_field_on_module_table	\N	\N	2026-06-12 07:09:41.481384+00	1
4fc2f804-3bc9-4112-83d7-55bf10a09d9b	f04cf165dc37b24303829378be95dfb568a5699894d6eacd6eb5d852b1342d6c	2026-06-12 07:09:41.500745+00	20260602081353_integration_table_quiz_report_et_modifications_des_tables_lies_aux_quizzes	\N	\N	2026-06-12 07:09:41.494168+00	1
47bb0d7f-e087-44ac-a023-626b6d1b2935	94f712fb2bc3bf760568d7972412a9ea51e84d19d2730ce79959f1f05e2f09e9	2026-06-12 07:09:41.487895+00	20260529115101_ajout_champs_course_slug_dans_course	\N	\N	2026-06-12 07:09:41.485277+00	1
5c9b6e72-2032-410d-bcf4-4d3534cdf0e0	3ee7eb19c6a251f3b1de1c1fed589e8e8bd8543dc61317ed8e2d5bd5d65c3956	2026-06-12 07:09:41.503849+00	20260603131304_fix_lien_entre_student_et_quiz	\N	\N	2026-06-12 07:09:41.501472+00	1
\.


--
-- Name: Accomplishment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Accomplishment_id_seq"', 4, true);


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 26, true);


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 13, true);


--
-- Name: Authorization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Authorization_id_seq"', 1, false);


--
-- Name: BonusActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BonusActivity_id_seq"', 1, false);


--
-- Name: BonusSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BonusSkill_id_seq"', 1, true);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 7, true);


--
-- Name: Course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Course_id_seq"', 2, true);


--
-- Name: Formation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Formation_id_seq"', 1, true);


--
-- Name: Group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Group_id_seq"', 1, true);


--
-- Name: LessonRating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LessonRating_id_seq"', 2, true);


--
-- Name: LessonRead_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LessonRead_id_seq"', 5, true);


--
-- Name: Lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Lesson_id_seq"', 12, true);


--
-- Name: Mediatheque_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mediatheque_id_seq"', 3, true);


--
-- Name: ModuleMetadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ModuleMetadata_id_seq"', 4, true);


--
-- Name: Module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Module_id_seq"', 4, true);


--
-- Name: Objective_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Objective_id_seq"', 1, true);


--
-- Name: OpenBadge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OpenBadge_id_seq"', 1, false);


--
-- Name: Parcours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Parcours_id_seq"', 1, true);


--
-- Name: QuizQuestionReport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QuizQuestionReport_id_seq"', 2, true);


--
-- Name: QuizQuestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QuizQuestion_id_seq"', 18, true);


--
-- Name: Quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quiz_id_seq"', 2, true);


--
-- Name: ResourceActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ResourceActivity_id_seq"', 1, false);


--
-- Name: ResourceBonusActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ResourceBonusActivity_id_seq"', 1, false);


--
-- Name: Resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Resource_id_seq"', 1, false);


--
-- Name: Skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Skill_id_seq"', 1, false);


--
-- Name: Student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Student_id_seq"', 7, true);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 52, true);


--
-- Name: Teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Teacher_id_seq"', 1, false);


--
-- Name: Accomplishment Accomplishment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accomplishment"
    ADD CONSTRAINT "Accomplishment_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Authorization Authorization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authorization"
    ADD CONSTRAINT "Authorization_pkey" PRIMARY KEY (id);


--
-- Name: BonusActivity BonusActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusActivity"
    ADD CONSTRAINT "BonusActivity_pkey" PRIMARY KEY (id);


--
-- Name: BonusSkill BonusSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkill"
    ADD CONSTRAINT "BonusSkill_pkey" PRIMARY KEY (id);


--
-- Name: BonusSkillsOnModuleMetadata BonusSkillsOnModuleMetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkillsOnModuleMetadata"
    ADD CONSTRAINT "BonusSkillsOnModuleMetadata_pkey" PRIMARY KEY ("bonusSkillId", "moduleId");


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: ContactsOnCourse ContactsOnCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnCourse"
    ADD CONSTRAINT "ContactsOnCourse_pkey" PRIMARY KEY ("contactId", "courseId");


--
-- Name: ContactsOnModuleMetadata ContactsOnModuleMetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnModuleMetadata"
    ADD CONSTRAINT "ContactsOnModuleMetadata_pkey" PRIMARY KEY ("contactId", "moduleId");


--
-- Name: ContactsOnParcours ContactsOnParcours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnParcours"
    ADD CONSTRAINT "ContactsOnParcours_pkey" PRIMARY KEY ("parcoursId", "contactId");


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Formation Formation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation"
    ADD CONSTRAINT "Formation_pkey" PRIMARY KEY (id);


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: GroupsOnParcours GroupsOnParcours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupsOnParcours"
    ADD CONSTRAINT "GroupsOnParcours_pkey" PRIMARY KEY ("groupId", "parcoursId");


--
-- Name: LessonRating LessonRating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRating"
    ADD CONSTRAINT "LessonRating_pkey" PRIMARY KEY (id);


--
-- Name: LessonRead LessonRead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRead"
    ADD CONSTRAINT "LessonRead_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Mediatheque Mediatheque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mediatheque"
    ADD CONSTRAINT "Mediatheque_pkey" PRIMARY KEY (id);


--
-- Name: ModuleMetadata ModuleMetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModuleMetadata"
    ADD CONSTRAINT "ModuleMetadata_pkey" PRIMARY KEY (id);


--
-- Name: Module Module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY (id);


--
-- Name: ModulesOnFormation ModulesOnFormation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModulesOnFormation"
    ADD CONSTRAINT "ModulesOnFormation_pkey" PRIMARY KEY ("moduleId", "formationId");


--
-- Name: Objective Objective_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Objective"
    ADD CONSTRAINT "Objective_pkey" PRIMARY KEY (id);


--
-- Name: OpenBadge OpenBadge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenBadge"
    ADD CONSTRAINT "OpenBadge_pkey" PRIMARY KEY (id);


--
-- Name: Parcours Parcours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parcours"
    ADD CONSTRAINT "Parcours_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestionReport QuizQuestionReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestionReport"
    ADD CONSTRAINT "QuizQuestionReport_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- Name: ResourceActivity ResourceActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceActivity"
    ADD CONSTRAINT "ResourceActivity_pkey" PRIMARY KEY (id);


--
-- Name: ResourceBonusActivity ResourceBonusActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceBonusActivity"
    ADD CONSTRAINT "ResourceBonusActivity_pkey" PRIMARY KEY (id);


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: SkillsOnParcours SkillsOnParcours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillsOnParcours"
    ADD CONSTRAINT "SkillsOnParcours_pkey" PRIMARY KEY ("skillId", "parcoursId");


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TagsOnCourse TagsOnCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnCourse"
    ADD CONSTRAINT "TagsOnCourse_pkey" PRIMARY KEY ("tagId", "courseId");


--
-- Name: TagsOnFormation TagsOnFormation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnFormation"
    ADD CONSTRAINT "TagsOnFormation_pkey" PRIMARY KEY ("tagId", "formationId");


--
-- Name: TagsOnParcours TagsOnParcours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnParcours"
    ADD CONSTRAINT "TagsOnParcours_pkey" PRIMARY KEY ("tagId", "parcoursId");


--
-- Name: TagsOnResources TagsOnResources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnResources"
    ADD CONSTRAINT "TagsOnResources_pkey" PRIMARY KEY ("tagId", "resourceId");


--
-- Name: Teacher Teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Contact_idMdb_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Contact_idMdb_key" ON public."Contact" USING btree ("idMdb");


--
-- Name: Formation_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Formation_title_key" ON public."Formation" USING btree (title);


--
-- Name: Parcours_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Parcours_title_key" ON public."Parcours" USING btree (title);


--
-- Name: QuizQuestion_contentHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QuizQuestion_contentHash_key" ON public."QuizQuestion" USING btree ("contentHash");


--
-- Name: Skill_description_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_description_key" ON public."Skill" USING btree (description);


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Accomplishment Accomplishment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accomplishment"
    ADD CONSTRAINT "Accomplishment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Accomplishment Accomplishment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accomplishment"
    ADD CONSTRAINT "Accomplishment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Activity Activity_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: Activity Activity_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BonusActivity BonusActivity_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusActivity"
    ADD CONSTRAINT "BonusActivity_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: BonusActivity BonusActivity_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusActivity"
    ADD CONSTRAINT "BonusActivity_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BonusSkill BonusSkill_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkill"
    ADD CONSTRAINT "BonusSkill_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BonusSkillsOnModuleMetadata BonusSkillsOnModuleMetadata_bonusSkillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkillsOnModuleMetadata"
    ADD CONSTRAINT "BonusSkillsOnModuleMetadata_bonusSkillId_fkey" FOREIGN KEY ("bonusSkillId") REFERENCES public."BonusSkill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BonusSkillsOnModuleMetadata BonusSkillsOnModuleMetadata_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BonusSkillsOnModuleMetadata"
    ADD CONSTRAINT "BonusSkillsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."ModuleMetadata"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactsOnCourse ContactsOnCourse_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnCourse"
    ADD CONSTRAINT "ContactsOnCourse_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactsOnCourse ContactsOnCourse_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnCourse"
    ADD CONSTRAINT "ContactsOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactsOnModuleMetadata ContactsOnModuleMetadata_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnModuleMetadata"
    ADD CONSTRAINT "ContactsOnModuleMetadata_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactsOnModuleMetadata ContactsOnModuleMetadata_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnModuleMetadata"
    ADD CONSTRAINT "ContactsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."ModuleMetadata"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactsOnParcours ContactsOnParcours_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnParcours"
    ADD CONSTRAINT "ContactsOnParcours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactsOnParcours ContactsOnParcours_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactsOnParcours"
    ADD CONSTRAINT "ContactsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: Course Course_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."ModuleMetadata"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Formation Formation_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation"
    ADD CONSTRAINT "Formation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupsOnParcours GroupsOnParcours_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupsOnParcours"
    ADD CONSTRAINT "GroupsOnParcours_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupsOnParcours GroupsOnParcours_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupsOnParcours"
    ADD CONSTRAINT "GroupsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonRating LessonRating_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRating"
    ADD CONSTRAINT "LessonRating_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonRating LessonRating_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRating"
    ADD CONSTRAINT "LessonRating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonRead LessonRead_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRead"
    ADD CONSTRAINT "LessonRead_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonRead LessonRead_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonRead"
    ADD CONSTRAINT "LessonRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: Lesson Lesson_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Lesson Lesson_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Mediatheque Mediatheque_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mediatheque"
    ADD CONSTRAINT "Mediatheque_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: ModuleMetadata ModuleMetadata_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModuleMetadata"
    ADD CONSTRAINT "ModuleMetadata_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: ModuleMetadata ModuleMetadata_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModuleMetadata"
    ADD CONSTRAINT "ModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ModuleMetadata ModuleMetadata_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModuleMetadata"
    ADD CONSTRAINT "ModuleMetadata_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Module Module_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: ModulesOnFormation ModulesOnFormation_formationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModulesOnFormation"
    ADD CONSTRAINT "ModulesOnFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES public."Formation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ModulesOnFormation ModulesOnFormation_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModulesOnFormation"
    ADD CONSTRAINT "ModulesOnFormation_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Objective Objective_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Objective"
    ADD CONSTRAINT "Objective_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Parcours Parcours_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parcours"
    ADD CONSTRAINT "Parcours_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: Parcours Parcours_formationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parcours"
    ADD CONSTRAINT "Parcours_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES public."Formation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizQuestionReport QuizQuestionReport_quizQuestionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestionReport"
    ADD CONSTRAINT "QuizQuestionReport_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestion QuizQuestion_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quiz Quiz_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quiz Quiz_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quiz Quiz_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quiz Quiz_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ResourceActivity ResourceActivity_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceActivity"
    ADD CONSTRAINT "ResourceActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ResourceBonusActivity ResourceBonusActivity_bonusActivityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceBonusActivity"
    ADD CONSTRAINT "ResourceBonusActivity_bonusActivityId_fkey" FOREIGN KEY ("bonusActivityId") REFERENCES public."BonusActivity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Resource Resource_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: SkillsOnParcours SkillsOnParcours_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillsOnParcours"
    ADD CONSTRAINT "SkillsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SkillsOnParcours SkillsOnParcours_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillsOnParcours"
    ADD CONSTRAINT "SkillsOnParcours_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnCourse TagsOnCourse_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnCourse"
    ADD CONSTRAINT "TagsOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TagsOnCourse TagsOnCourse_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnCourse"
    ADD CONSTRAINT "TagsOnCourse_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnFormation TagsOnFormation_formationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnFormation"
    ADD CONSTRAINT "TagsOnFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES public."Formation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnFormation TagsOnFormation_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnFormation"
    ADD CONSTRAINT "TagsOnFormation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnParcours TagsOnParcours_parcoursId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnParcours"
    ADD CONSTRAINT "TagsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES public."Parcours"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnParcours TagsOnParcours_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnParcours"
    ADD CONSTRAINT "TagsOnParcours_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnResources TagsOnResources_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnResources"
    ADD CONSTRAINT "TagsOnResources_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TagsOnResources TagsOnResources_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TagsOnResources"
    ADD CONSTRAINT "TagsOnResources_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict aOBvXN1egEY71FFSLzy720xdHkgjcWb7Zr00cTwdazcPRnHPePWH02sqAax07k3

