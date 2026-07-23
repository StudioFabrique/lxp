--
-- PostgreSQL database dump
--

\restrict 6GdrNtOYexRGIkPFAs8d8xFnaWA4rGUCwJa5sPxl9OYHTiQCNzqcgANzAC9Bbg9

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

--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, "idMdb") FROM stdin;
1	6a61bc4254c27d352df07c3f
\.


--
-- Data for Name: Formation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Formation" (id, title, description, code, level, "createdAt", "updatedAt", "adminId") FROM stdin;
\.


--
-- Data for Name: Module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Module" (id, title, description, image, thumb, "createdAt", "updatedAt", author, "adminId", "quizInstructions", "duplicationIndex") FROM stdin;
\.


--
-- Data for Name: Parcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Parcours" (id, title, description, "startDate", "endDate", degree, image, thumb, "createdAt", "updatedAt", author, visibility, "adminId", "formationId", "virtualClass", "isPublished", "duplicationIndex") FROM stdin;
\.


--
-- Data for Name: ModuleMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ModuleMetadata" (id, duration, rating, "minDate", "maxDate", "moduleId", "createdAt", "updatedAt", "adminId", "parcoursId") FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, description, image, "moduleId", "virtualClass", visibility, scenario, dates, "order", "isPublished", "createdAt", "updatedAt", author, "adminId", "courseSlug", "duplicationIndex") FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "idMdb") FROM stdin;
\.


--
-- Data for Name: Accomplishment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Accomplishment" (id, name, description, "accomplishedAt", "hasBeenCongratulated", "studentId", "showToOtherStudent", "courseId") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, color, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lesson" (id, title, description, modalite, "createdAt", "updatedAt", author, "adminId", "courseId", "tagId", "order", "isPublished", visibility, "duplicationIndex") FROM stdin;
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, title, type, "order", url, "lessonId", "createdAt", "updatedAt", "authorId", "duplicationIndex") FROM stdin;
\.


--
-- Data for Name: Authorization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Authorization" (id, role, action, resource) FROM stdin;
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resource" (id, title, description, "createdAt", "updatedAt", author, "adminId", "imageUrl") FROM stdin;
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
\.


--
-- Data for Name: BonusSkillsOnModuleMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BonusSkillsOnModuleMetadata" ("bonusSkillId", "moduleId") FROM stdin;
\.


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contact" (id, "idMdb", name, role, email, phone, "createdAt", "updatedAt") FROM stdin;
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
\.


--
-- Data for Name: ContactsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactsOnParcours" ("parcoursId", "contactId") FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, "idMdb") FROM stdin;
\.


--
-- Data for Name: GroupsOnParcours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupsOnParcours" ("groupId", "parcoursId") FROM stdin;
\.


--
-- Data for Name: LessonRating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonRating" (id, rating, "lessonId", "studentId") FROM stdin;
\.


--
-- Data for Name: LessonRead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonRead" (id, "beganAt", "lastOpenedAt", "finishedAt", "lessonId", "studentId") FROM stdin;
\.


--
-- Data for Name: Mediatheque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mediatheque" (id, type, url, name, "authorId", size, used, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ModulesOnFormation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ModulesOnFormation" ("moduleId", "formationId") FROM stdin;
\.


--
-- Data for Name: Objective; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Objective" (id, description, "createdAt", "updatedAt", "parcoursId") FROM stdin;
\.


--
-- Data for Name: OpenBadge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenBadge" (id, creator, image, url, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quiz" (id, title, type, "moduleId", "activityId", "courseId", "createdAt", "updatedAt", "studentId") FROM stdin;
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizQuestion" (id, "externalId", type, difficulty, prompt, "explanationTrue", "explanationWrong", tags, data, "contentHash", "createdAt", "updatedAt", "quizId") FROM stdin;
\.


--
-- Data for Name: QuizQuestionReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizQuestionReport" (id, "quizQuestionId", commentaire) FROM stdin;
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
-- Data for Name: TagsOnCourse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnCourse" ("tagId", "courseId") FROM stdin;
\.


--
-- Data for Name: TagsOnFormation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TagsOnFormation" ("tagId", "formationId") FROM stdin;
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
e3c83c76-b5f0-49df-8980-8795f9f99331	680279e09bb6b7e4b7124cd427f3ea3f2857b1f42c57fba45e6d7a551c84e7b8	2026-07-23 06:55:19.828404+00	20250124140724_ajout_mail_phone_a_contact	\N	\N	2026-07-23 06:55:19.789159+00	1
02813c2a-1fdd-45f2-b5c8-99e4124b351e	4809f0347d94c23c54b26c04f140b3cd204279f9dfc305d24d334888e97b13a2	2026-07-23 06:55:19.933737+00	20250930133001_module_metadata	\N	\N	2026-07-23 06:55:19.924376+00	1
3659b51c-4483-4d46-acdd-287b30e36fa4	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2026-07-23 06:55:19.832996+00	20250203120710_empty_migration	\N	\N	2026-07-23 06:55:19.830236+00	1
abba18d3-8a07-484e-9bf3-49c08c064e70	2199bc4644859110d626c851d85dafc38f6ba90d569b9e222a39a14837815d54	2026-07-23 06:55:19.840726+00	20250203120913_ajout_telephone_valeur_par_defaut_a_contact	\N	\N	2026-07-23 06:55:19.835512+00	1
ecf90dd4-a250-4be4-914b-1280c99c66ac	1d68947a61a5a9b19ead4eb3361f70becf3c3ec1e37c3b7d6292c9c57445c600	2026-07-23 06:55:20.005404+00	20251127092142_description_field_removed_from_activity_and_bonus_activity	\N	\N	2026-07-23 06:55:19.99971+00	1
13264a7e-7c1b-45a4-861f-392fcfdd917f	c68a9dfc29e1dbbf85b7bb209a0ff36a2823b9c1391829b430f9773ac3ffc13a	2026-07-23 06:55:19.8476+00	20250205101717_formation_code_et_description_optionnels	\N	\N	2026-07-23 06:55:19.842225+00	1
3aa53bfe-94b7-4689-b953-55c56d5a5632	e0a541e724d89c26d3ddd63de95d4d83b0babfbf1ae182f5e673f740b56c6e1c	2026-07-23 06:55:19.94799+00	20250930143011_test2	\N	\N	2026-07-23 06:55:19.935536+00	1
3740c533-8398-4f24-b6a9-03d627360240	b155ce2ddd5f9e3013709b311f5355dd05c758e2510e4655a3b1bbdd8069bb0a	2026-07-23 06:55:19.856384+00	20250207073145_creation_table_lesson_rating	\N	\N	2026-07-23 06:55:19.849464+00	1
c1fb4b1d-a0a6-43c0-971f-7bcb4d72fb15	08f167f0199ea0367a18576acf552235bea1ca68be076555905096c6799ef5b6	2026-07-23 06:55:19.863259+00	20250304124150_ajout_propriete_show_to_other_student_dans_accomplishment	\N	\N	2026-07-23 06:55:19.858263+00	1
f66ee35a-32d1-4061-b0f5-928f67a14113	9815ff1fd0cfecb09965219e8b6b66cce662b7f8537e280a699e192c2662380e	2026-07-23 06:55:19.872688+00	20250305090736_ajout_relation_accomplishment_et_course	\N	\N	2026-07-23 06:55:19.865133+00	1
969c5935-23de-43a8-9cae-b2cc8e810a55	2262fbec4875e7fac7482ca5a2b3d7d1abc2023f65fdcdc60be8e25b5d9f3689	2026-07-23 06:55:19.956562+00	20251001071542_ajustements	\N	\N	2026-07-23 06:55:19.949614+00	1
8a70bd7a-bcdd-448c-97f6-427636a983a6	fc0574713275f85c433d11957ae2f51a8769b70daabd44ab381a158265ceff4e	2026-07-23 06:55:19.885792+00	20250305144743_on_delete_user_set_default_test	\N	\N	2026-07-23 06:55:19.874641+00	1
b1447b6c-7216-45cd-84b2-884f6cbc3370	5f3ef6839dc480ad79db164398646634b2664ffc8475b4bfb73a1ff884c6c75e	2026-07-23 06:55:19.897803+00	20250910080737_resource_image_url	\N	\N	2026-07-23 06:55:19.887306+00	1
86b8b8d8-0c9f-4fed-9262-a82239ed06aa	fd9dd74d6af8b7848790e388d250a6cd98ad9c76926cfc4a65b8ca66749e947d	2026-07-23 06:55:20.045468+00	20260601141529_nouvelles_tables_relatives_aux_quizzes	\N	\N	2026-07-23 06:55:20.036394+00	1
68949943-a7eb-4280-9a13-59beb925b873	345584238fb5265498fe0e024e4f4e54aacc005174719ddd91c686a5c2903b4c	2026-07-23 06:55:19.905964+00	20250910121131_removed_author_from_bonus_activity	\N	\N	2026-07-23 06:55:19.899763+00	1
78b4801d-0480-41f9-8bbb-2f6ba734e7fd	3f8b31dc47343935e73651526c7eb9f9e852fa3af35f533a7bd0bae6b88f2855	2026-07-23 06:55:19.965181+00	20251001072347_ajustements	\N	\N	2026-07-23 06:55:19.958496+00	1
bed3e925-4f84-45bc-9cc3-741ebb80ff11	c21a7c10d1be9a67d523f2dbc80260325931529e0c478c171abb348a609daa8c	2026-07-23 06:55:19.913053+00	20250910121506_removed_author_from_bonus_activity	\N	\N	2026-07-23 06:55:19.908073+00	1
0a9817fc-675a-405b-8921-8e4ea5bb10f2	d817094c197508e377c19eec4ae208b09a77424955e1260475f2128828ee5767	2026-07-23 06:55:19.922396+00	20250911085433_table_resource_bonus_activity	\N	\N	2026-07-23 06:55:19.914891+00	1
f20e82b9-7f19-4e19-9fe6-fd89308ad255	097514af94c52437ba923cbbc7acf2da5fe36254f9f92714342952137c2637c8	2026-07-23 06:55:20.012812+00	20260122085615_added_ondelete_cascade_to_bonusskill_table	\N	\N	2026-07-23 06:55:20.007022+00	1
139b9ca6-7822-40c1-9621-efd115ea7728	89d3a1db619015b9ba3f0bdedcb2aa5e56ea13f6403187bc2b4c351c33438a64	2026-07-23 06:55:19.973709+00	20251008093540_removed_objectives_and_skills_from_course	\N	\N	2026-07-23 06:55:19.966722+00	1
faa7ab14-5676-4247-930e-f5204f7c426e	bc8821539fe82aa8af1e3afed730001227f0bb0dcf4e71ecbe8d2b415db5d3e2	2026-07-23 06:55:19.981233+00	20251022085643_on_cascade_sur_many_to_many_modulesmetadatas	\N	\N	2026-07-23 06:55:19.975053+00	1
558d2e6e-9b36-47fd-ad5b-d6d72ff46558	332789b57d64cfa883de74888670fd334bce4b9583a9491558fd398da8d48c5e	2026-07-23 06:55:19.988757+00	20251022094142_on_delete_sur_modulesonformation	\N	\N	2026-07-23 06:55:19.982727+00	1
fa30cf3e-1b60-42e3-8075-21ec6ba7bc83	d89a9bf6f0d0a83f520bd23932982057fc8a44fc6ee31a0e4fb827a7ffb8bc83	2026-07-23 06:55:20.020213+00	20260127151646_added_authorization_table_for_ia_modules	\N	\N	2026-07-23 06:55:20.014406+00	1
158e4e3c-8463-471e-a8cf-5da5fee4de18	18fb6f222f9df92e21ae4772820cfc2b9637b45b9ba2c7c301817e92aa57455c	2026-07-23 06:55:19.998141+00	20251104090811_cascade_sur_course_lesson_et_activite	\N	\N	2026-07-23 06:55:19.990185+00	1
99db8deb-642e-47a6-bb2c-4c53fbe6d12e	472add325fc0fd22d88f34890d4ae861c75e841dffb408544a1f3c893175734a	2026-07-23 06:55:20.075093+00	20260720090000_add_content_duplication_indexes	\N	\N	2026-07-23 06:55:20.068533+00	1
6cbe6625-5aa3-4661-a6b2-45b42acc664f	2772bff591f023b176528cae4c22737717038aa959537d765e0a107fbc533e65	2026-07-23 06:55:20.027113+00	20260519132228_added_quiz_instructions_field_on_module_table	\N	\N	2026-07-23 06:55:20.022111+00	1
1ed8bc30-4024-4760-a7c6-ff26e8634a66	f04cf165dc37b24303829378be95dfb568a5699894d6eacd6eb5d852b1342d6c	2026-07-23 06:55:20.059424+00	20260602081353_integration_table_quiz_report_et_modifications_des_tables_lies_aux_quizzes	\N	\N	2026-07-23 06:55:20.04736+00	1
baafc429-697c-49b1-b818-c153c62d37b2	94f712fb2bc3bf760568d7972412a9ea51e84d19d2730ce79959f1f05e2f09e9	2026-07-23 06:55:20.034348+00	20260529115101_ajout_champs_course_slug_dans_course	\N	\N	2026-07-23 06:55:20.028748+00	1
8c33a198-def7-440e-9006-fec2524205b7	3ee7eb19c6a251f3b1de1c1fed589e8e8bd8543dc61317ed8e2d5bd5d65c3956	2026-07-23 06:55:20.066929+00	20260603131304_fix_lien_entre_student_et_quiz	\N	\N	2026-07-23 06:55:20.061332+00	1
\.


--
-- Name: Accomplishment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Accomplishment_id_seq"', 1, false);


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 1, false);


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


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

SELECT pg_catalog.setval('public."BonusSkill_id_seq"', 1, false);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 1, false);


--
-- Name: Course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Course_id_seq"', 1, false);


--
-- Name: Formation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Formation_id_seq"', 1, false);


--
-- Name: Group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Group_id_seq"', 1, false);


--
-- Name: LessonRating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LessonRating_id_seq"', 1, false);


--
-- Name: LessonRead_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LessonRead_id_seq"', 1, false);


--
-- Name: Lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Lesson_id_seq"', 1, false);


--
-- Name: Mediatheque_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mediatheque_id_seq"', 1, false);


--
-- Name: ModuleMetadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ModuleMetadata_id_seq"', 1, false);


--
-- Name: Module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Module_id_seq"', 1, false);


--
-- Name: Objective_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Objective_id_seq"', 1, false);


--
-- Name: OpenBadge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OpenBadge_id_seq"', 1, false);


--
-- Name: Parcours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Parcours_id_seq"', 1, false);


--
-- Name: QuizQuestionReport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QuizQuestionReport_id_seq"', 1, false);


--
-- Name: QuizQuestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QuizQuestion_id_seq"', 1, false);


--
-- Name: Quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quiz_id_seq"', 1, false);


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

SELECT pg_catalog.setval('public."Student_id_seq"', 1, false);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 1, false);


--
-- Name: Teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Teacher_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict 6GdrNtOYexRGIkPFAs8d8xFnaWA4rGUCwJa5sPxl9OYHTiQCNzqcgANzAC9Bbg9

